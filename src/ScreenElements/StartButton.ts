import { Color, Engine, ScreenElement, vec, Vector } from "excalibur";
import { Resources } from "../resources";
import { Signal } from "../Lib/Signals";
import { sndPlugin } from "../main";

export class Startbutton extends ScreenElement {
  playerUpdateSignal = new Signal("playerUpdate");
  constructor() {
    super({ width: 128, height: 64, pos: new Vector(32 * 6 - 64, 32 * 20) });
    this.graphics.use(Resources.StartButtonUp.toSprite());
  }

  onInitialize(engine: Engine): void {
    this.on("pointerup", () => {
      sndPlugin.playSound("buttonClick");
      engine.goToScene("main");
    });
    this.playerUpdateSignal.send([vec(this.pos.x + 64, this.pos.y), 128]);
  }
}

export class RestartButton extends ScreenElement {
  resetGameSignal = new Signal("resetGame");
  playerUpdateSignal = new Signal("playerUpdate");
  constructor() {
    super({ width: 128, height: 64, color: Color.Transparent }); //pos: new Vector(32 * 6 - 64, 32 * 20)
    this.graphics.use(Resources.RestartButtonUp.toSprite());
  }

  onInitialize(engine: Engine): void {
    this.on("pointerup", () => {
      sndPlugin.playSound("buttonClick");
      this.resetGameSignal.send();
      engine.goToScene("main");
    });
    this.playerUpdateSignal.send([vec(this.pos.x + 64, this.pos.y), 128]);
  }
}
