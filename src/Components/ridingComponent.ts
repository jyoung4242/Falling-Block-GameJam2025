import { Component } from "excalibur";
import { Block } from "../Actors/block";

export class RidingComponent extends Component {
  isRiding: boolean = false;
  BlockBeingRidden: Block | null = null;

  constructor() {
    super();
  }

  update(engine: any, delta: number): void {}
}
