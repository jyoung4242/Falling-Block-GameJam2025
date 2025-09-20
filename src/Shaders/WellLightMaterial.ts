import { Engine, Material } from "excalibur";

const WellLightMateiral: Material | null = null;

const fragSource = `#version 300 es
precision mediump float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_graphic;
uniform float u_lightHeight;     // 0 = light at bottom, 1 = light at top
uniform vec4  u_lightColor;      // color of the light
uniform float u_strength;        // brightness multiplier
uniform vec4  u_backgroundColor; // background color

void main() {
    vec4 base = texture(u_graphic, v_uv);

    // Skip transparent / background pixels
    float diff = distance(base.rgb, u_backgroundColor.rgb);
    if (diff < 0.01 || base.a < 0.01) {
        outColor = vec4(u_backgroundColor.rgb, 1.0);
        return;
    }

    // ---- Vertical falloff (top light) ----
// Flip v_uv.y because texture coords start at top
float y = 1.0 - v_uv.y;
float intensityY = clamp(y - (1.0 - u_lightHeight), 0.0, 1.0);
intensityY = pow(intensityY, 1.5);

    // ---- Radial falloff (circular well) ----
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(v_uv, center);

    // Edges brighter, center darker
    float radial = smoothstep(0.0, 0.5, dist);
    radial = pow(radial, 0.8);

    // Combine vertical and radial
    float intensity = intensityY * radial;

    // ---- Strong depth mask for bottom center ----
    float depth = 1.0 - smoothstep(0.0, 0.7, dist); // 1 at center, 0 at edges
    depth = pow(depth, 3.0);                        // sharper pit
    intensity *= 1.0 - 0.9 * depth;                 // darken center almost completely

    // Apply lighting
    vec3 lit = mix(base.rgb * 0.3,
                   base.rgb * u_lightColor.rgb * u_strength,
                   intensity);

    outColor = vec4(lit, base.a);
}
`;

export function makeWellLightMaterial(engine: Engine) {
  return engine.graphicsContext.createMaterial({ fragmentSource: fragSource });
}
