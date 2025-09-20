import { Actor, CollisionType, Color, Vector } from "excalibur";
import { blockcolliderGroup } from "../colliderGroups";

export class SideWall extends Actor {
  private _side: "left" | "right";
  constructor(side: "left" | "right") {
    let myPos: Vector = Vector.Zero;
    if (side === "left") {
      myPos = new Vector(-32, 0);
    } else {
      myPos = new Vector(32 * 12, 0);
    }

    super({
      pos: myPos,
      width: 32,
      height: 32 * 25,
      anchor: new Vector(0, 0),
      color: Color.Transparent,
      collisionType: CollisionType.Fixed,
      collisionGroup: blockcolliderGroup,
      z: 20,
    });
    this._side = side;
  }

  get side(): "left" | "right" {
    return this._side;
  }
}
