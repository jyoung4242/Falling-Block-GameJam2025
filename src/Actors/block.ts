import {
  Actor,
  Collider,
  CollisionContact,
  CollisionType,
  Color,
  Engine,
  Material,
  Random,
  Shader,
  Side,
  TileMap,
  vec,
  Vector,
} from "excalibur";
import { rockyMaterial } from "../Shaders/RockShader";
import { blockcolliderGroup } from "../colliderGroups";
import { Signal } from "../Lib/Signals";
import { Resources } from "../resources";
import { sndPlugin } from "../main";
import { StaticLayer } from "./staticLayer";

export class Block extends Actor {
  //signals
  blockSignal = new Signal("blockLanded");
  blockStopSignal = new Signal("blockStop");
  clearWarningSignal = new Signal("clearWarning");

  //properties
  material: Material | null = null;
  rng: Random;
  maxSpeed = 65;
  level = 1;
  resetPeriod = 1000;
  restTik = 0;

  //flags
  isBlockStopped: boolean = false;

  constructor(pos: Vector, seed: number, level = 1) {
    let rng = new Random(seed);
    super({
      z: 11,
      pos,
      width: rng.integer(25, 75),
      height: rng.integer(25, 75),
      collisionType: CollisionType.Active,
      color: Color.Transparent,
      collisionGroup: blockcolliderGroup,
    });

    // check width versus position
    if (this.pos.x + this.width / 2 > 384) this.pos.x = 384 - this.width;
    if (this.pos.x - this.width / 2 < 64) this.pos.x = 64 + this.width / 2;

    this.rng = rng;

    //set max vel by level
    for (let i = 0; i < level; i++) {
      this.maxSpeed *= 1.1;
    }
  }

  onInitialize(engine: Engine): void {
    let temprockTexture = this.rng.pickOne(loadRockTextures());

    this.material = engine.graphicsContext.createMaterial({
      fragmentSource: rockyMaterial,
      name: "rockyMaterial",
      images: {
        u_rockGraphic: temprockTexture,
      },
    });

    this.graphics.material = this.material;
    this.material.update((s: Shader) => {
      s.trySetUniformFloat("u_radius", 0.25);
      s.setUniformFloatColor("u_borderColor", Color.fromHex("#131f11ff"));
      s.trySetUniformFloat("u_border", 0.05);
      s.trySetUniformFloatColor("u_tintColor", Color.fromHex(`#799324`));
      s.trySetUniformFloat("u_tintStrength", 0.25);
    });

    this.clearWarningSignal.send();
    this.acc = vec(0, 15);
  }

  get blockState() {
    return this.isBlockStopped;
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Block || other.owner instanceof StaticLayer) {
      this.vel = vec(0, 0);
      this.acc = vec(0, 0);

      if (!this.isBlockStopped) {
        this.isBlockStopped = true;
        sndPlugin.playSound("block");
        this.body.collisionType = CollisionType.Fixed;
        this.blockSignal.send();
        //test for end position being at the top of the level
        if (this.pos.y < 0) {
          this.blockStopSignal.send();
        }
      }
    }
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    //update velocity with acc
    this.vel = this.vel.add(this.acc);
    //max vel check
    if (Math.abs(this.vel.y) >= this.maxSpeed) {
      if (this.vel.y > 0) this.vel.y = this.maxSpeed;
      if (this.vel.y < 0) this.vel.y = -this.maxSpeed;
    }
  }
}

const loadRockTextures = () => {
  return [
    Resources.rock1,
    Resources.rock2,
    Resources.rock3,
    Resources.rock4,
    Resources.rock5,
    Resources.rock6,
    Resources.rock7,
    Resources.rock8,
    Resources.rock9,
    Resources.rock10,
    Resources.rock11,
    Resources.rock12,
    Resources.rock13,
    Resources.rock14,
  ];
};
