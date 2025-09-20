import { Actor, Collider, CollisionContact, CollisionType, Side, Timer, vec } from "excalibur";
import { Resources } from "../resources";
import { exitCollisionGroup } from "../colliderGroups";
import { Player } from "./player";
import { Signal } from "../Lib/Signals";
import { shockWavePP, sndPlugin } from "../main";

export class Exit extends Actor {
  changeTimeSignal = new Signal("changeTime");
  timer: Timer | undefined = undefined;

  constructor(xPos: number = 32 * 6) {
    super({
      x: xPos,
      y: 8,
      radius: 16,
      z: 10,
      scale: vec(2, 2),
      collisionType: CollisionType.Passive,
      collisionGroup: exitCollisionGroup,
    });

    this.graphics.use(Resources.Exit.toSprite());
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Player) {
      this.changeTimeSignal.send(["slow"]);
      const screenPos = this.scene?.engine.worldToScreenCoordinates(this.pos);
      const screenDims = this.scene?.engine.screen.resolution;
      if (!screenPos) return;
      sndPlugin.playSound("exit");
      shockWavePP.triggerShockWave(
        vec(screenPos.x / screenDims!.width, screenPos.y / screenDims!.height),
        2000, // duration
        75, // speed
        0.5, // max radius
        0.1 // thickness
      );

      setTimeout(() => {
        this.changeTimeSignal.send(["normal"]);
        this.scene?.engine.goToScene("eol", { sceneActivationData: { status: "win" } });
      }, 2500);
    }
  }
}
