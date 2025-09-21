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
      debugger;
      engine.goToScene("main", { sceneActivationData: { newGame: true } });
    });
  }
}

export class RestartButton extends ScreenElement {
  resetGameSignal = new Signal("resetGame");
  playerUpdateSignal = new Signal("playerUpdate");
  mode: "win" | "lose" | undefined;
  constructor() {
    super({ width: 128, height: 64, color: Color.Transparent }); //pos: new Vector(32 * 6 - 64, 32 * 20)
    this.graphics.use(Resources.RestartButtonUp.toSprite());
  }

  setMode(mode: "win" | "lose") {
    this.mode = mode;
  }

  onInitialize(engine: Engine): void {
    this.on("pointerup", () => {
      sndPlugin.playSound("buttonClick");
      this.resetGameSignal.send();
      if (this.mode == "win") engine.goToScene("eol", { sceneActivationData: { newGame: false } });
      else engine.goToScene("eol", { sceneActivationData: { newGame: true } });
    });
  }
}
