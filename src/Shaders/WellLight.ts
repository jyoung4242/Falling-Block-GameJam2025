import { Color, Engine, PostProcessor, ScreenShader, Shader, vec, Vector, VertexLayout } from "excalibur";
import { Signal } from "../Lib/Signals";

export class WellLighting implements PostProcessor {
  lightColor: Color = Color.White;
  lightHeight: number = 0.2; // 0 = light at bottom, 1 = light at top
  backgroundColor: Color = Color.Black;
  strength: number = 2.0; // brightness multiplier
  playerScreenPos: Vector = vec(0, 0);
  playerRadius: number = 300; // radius of the light around the player
  playerUpdateSignal = new Signal("playerUpdate");
  engine: Engine;

  constructor(engine: Engine, lightColor: Color, lightHeight: number, strength: number, backgroundColor: Color) {
    if (lightColor) this.lightColor = lightColor;
    if (lightHeight) this.lightHeight = lightHeight;
    if (strength) this.strength = strength;
    if (backgroundColor) this.backgroundColor = backgroundColor;
    this.playerUpdateSignal.listen((e: CustomEvent) => {
      let params = e.detail.params;
      this.playerScreenPos = params[0];
      this.playerRadius = params[1];
    });
    this.engine = engine;
  }

  //@ts-ignore
  private _shader: ScreenShader;
  initialize(gl: WebGL2RenderingContext): void {
    this._shader = new ScreenShader(
      gl,
      `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_image;
uniform float u_lightHeight;        // 0 = light at bottom, 1 = light at top
uniform vec4 u_lightColor;          // color of the light
uniform float u_strength;           // brightness multiplier
uniform vec4 u_backgroundColor;     // background color

// NEW uniforms
uniform vec2  u_playerPos;   // player screen position in pixels
uniform vec2  u_resolution;  // screen width/height in pixels
uniform float u_playerRadius;// radius of halo in pixels

void main() {
    vec4 base = texture(u_image, v_uv);

    float diff = distance(base.rgb, u_backgroundColor.rgb);
    if (diff < 0.01 || base.a < 0.01) {
        outColor = vec4(u_backgroundColor.rgb, 1.0);
        return;
    }

    // ---- Vertical falloff (top light) ----
    float intensityY = clamp(v_uv.y - (1.0 - u_lightHeight), 0.0, 1.0);
    intensityY = pow(intensityY, 1.5);

    // ---- Radial falloff (circular well) ----
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(v_uv, center);

    // Radial intensity: edges brighter, center darker
    float radial = smoothstep(0.0, 0.5, dist);
    radial = pow(radial, 0.8);

    // Combine vertical and radial
    float intensity = intensityY * radial;

    
    // ---- Player halo ----
    vec2 playerUV = u_playerPos / u_resolution;
    float pDist = distance(v_uv, playerUV);
    float radiusUV = u_playerRadius / min(u_resolution.x, u_resolution.y);
    float playerGlow = 1.0 - smoothstep(0.0, radiusUV, pDist);
    
    // ---- Strong depth mask for bottom center ----
    float depth = 1.0 - smoothstep(0.0, 0.7, dist); // 1 at center, 0 at edges
    depth = pow(depth, 3.0);                        // sharper pit
    intensity *= 1.0 - 0.9 * depth;                 // darken center almost completely

    // Apply lighting
    //vec3 lit = mix(base.rgb * 0.3,base.rgb * u_lightColor.rgb * u_strength,intensity);
    // >>> Instead of adding/tinting, just keep the original color inside the glow
    //lit = mix(lit, base.rgb, playerGlow);
    vec3 lit = mix(base.rgb * 0.3, base.rgb * u_lightColor.rgb * u_strength, intensity);
    lit = mix(lit, base.rgb, playerGlow); // untinted in halo
    outColor = vec4(lit, base.a);
}  `
    );
  }
  getLayout(): VertexLayout {
    return this._shader.getLayout();
  }
  getShader(): Shader {
    return this._shader.getShader();
  }

  onUpdate(elapsed: number): void {
    let shader = this._shader.getShader();
    if (!shader) return;
    shader.trySetUniformFloatColor("u_lightColor", this.lightColor);
    shader.trySetUniformFloat("u_lightHeight", this.lightHeight);
    shader.trySetUniformFloat("u_strength", this.strength);
    shader.trySetUniformFloatColor("u_backgroundColor", this.backgroundColor);

    /* new player uniforms */
    // NEW uniforms
    const screenY = this.engine.drawHeight - this.playerScreenPos.y; // invert Y for screen coords
    shader.trySetUniformFloatVector("u_playerPos", vec(this.playerScreenPos.x, screenY));
    shader.trySetUniformFloatVector("u_resolution", new Vector(this.engine.drawWidth, this.engine.drawHeight));
    shader.trySetUniformFloat("u_playerRadius", this.playerRadius);
  }
}
