import { Actor, CollisionType, Color, Engine, Material, Shader, Shape, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { FloorCollisionGroup } from "../colliderGroups";
import { makeWellLightMaterial } from "../Shaders/WellLightMaterial";

export class StaticLayer extends Actor {
  material: Material | null = null;
  lightColor: Color = Color.White;
  lightHeight: number = 0.8; // 0 = light at bottom, 1 = light at top
  backgroundColor: Color = Color.ExcaliburBlue;
  strength: number = 2.0; // brightness multiplier
  playerScreenPos: Vector = vec(0, 0);
  playerRadius: number = 300; // radius of the light around the player
  //playerUpdateSignal = new Signal("playerUpdate");
  //engine: Engine;
  constructor() {
    const floorCollider = Shape.Box(32 * 12, 32 * 1, vec(0, 0), vec(0, 32 * 24));
    super({
      color: Color.Transparent,
      z: -1,
      collider: floorCollider,
      collisionType: CollisionType.Fixed,
      collisionGroup: FloorCollisionGroup,
      anchor: vec(0, 0),
    });
    //game, Color.White, 0.8, 2.0, Color.ExcaliburBlue
    this.graphics.use(Resources.map.toSprite());
  }

  onInitialize(engine: Engine): void {
    this.material = makeWellLightMaterial(engine);
    this.graphics.material = this.material;
    this.material.update((shader: Shader) => {
      if (!shader) return;
      shader.trySetUniformFloatColor("u_lightColor", this.lightColor);
      shader.trySetUniformFloat("u_lightHeight", this.lightHeight);
      shader.trySetUniformFloat("u_strength", this.strength);
      shader.trySetUniformFloatColor("u_backgroundColor", this.backgroundColor);
    });
  }
}
