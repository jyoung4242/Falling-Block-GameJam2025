import { Engine, Scene, SceneActivationContext } from "excalibur";
import { TitleTextElement } from "../ScreenElements/TitleText";
import { Startbutton } from "../ScreenElements/StartButton";
import { initializeMap, levelMap } from "../Actors/level";
import { StaticLayer } from "../Actors/staticLayer";
import { soundManager } from "../main";

export class IntroScene extends Scene {
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    soundManager.play("titleSong");
  }
  onDeactivate(context: SceneActivationContext) {
    soundManager.stop("titleSong");
  }
  onInitialize(engine: Engine): void {
    this.add(new TitleTextElement());
    this.add(new Startbutton());

    //this.add(levelMap);
    this.add(new StaticLayer());
  }
}
