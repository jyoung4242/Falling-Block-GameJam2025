import { Engine, Scene, SceneActivationContext } from "excalibur";
import { TitleTextElement } from "../ScreenElements/TitleText";
import { Startbutton } from "../ScreenElements/StartButton";
import { initializeMap, levelMap } from "../Actors/level";
import { StaticLayer } from "../Actors/staticLayer";
import { soundManager } from "../main";
import { Signal } from "../Lib/Signals";

export class IntroScene extends Scene {
  gpad = new Signal("gamepad");
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    soundManager.play("titleSong");
    this.gpad.listen((evt: CustomEvent) => {
      let gpadInterface = evt.detail.params[1];
      let gpadValue = evt.detail.params[2];
      if (gpadInterface == "buttonPressed" && gpadValue == 0) {
        context.engine.goToScene("main");
      }
    });
  }
  onDeactivate(context: SceneActivationContext) {
    soundManager.stop("titleSong");
    this.gpad.stopListening();
  }
  onInitialize(engine: Engine): void {
    this.add(new TitleTextElement());
    this.add(new Startbutton());

    //this.add(levelMap);
    this.add(new StaticLayer());
  }
}
