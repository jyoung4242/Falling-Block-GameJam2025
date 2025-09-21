import { Color, Engine, Scene, SceneActivationContext, vec } from "excalibur";
import { TitleTextElement } from "../ScreenElements/TitleText";
import { Startbutton } from "../ScreenElements/StartButton";
import { initializeMap, levelMap } from "../Actors/level";
import { StaticLayer } from "../Actors/staticLayer";
import { soundManager } from "../main";
import { Signal } from "../Lib/Signals";
import { UIContainer, UILayout } from "../Lib/UILayout";
import { InstructionsElement } from "../ScreenElements/TitleUIElements";

export class IntroScene extends Scene {
  buttonState: boolean = false;
  latchState: boolean = false;
  gpad = new Signal("gamepad");
  layout: any;
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    soundManager.play("titleSong");
    this.gpad.listen((evt: CustomEvent) => {
      let gpadInterface = evt.detail.params[1];
      let gpadValue = evt.detail.params[2];

      if (gpadInterface == "buttonPressed" && gpadValue == 0) {
        this.buttonState = true;
      }
      if (gpadInterface == "buttonReleased" && gpadValue == 0 && this.buttonState) {
        context.engine.goToScene("main", { sceneActivationData: { newGame: true } });
      }
    });
  }
  onDeactivate(context: SceneActivationContext) {
    soundManager.stop("titleSong");
    this.gpad.stopListening();
  }
  onInitialize(engine: Engine): void {
    this.layout = new UILayout(this);
    const mainContainer = new UIContainer({
      name: "mainContainer",
      width: 32 * 12,
      height: 32 * 25,
      padding: {
        leftPadding: 0,
        rightPadding: 0,
        topPadding: 15,
        bottomPadding: 0,
      },
      gap: 15,
      layoutDirection: "vertical",
      positionContentStrategy: "fixed",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    this.layout.root.addChildContainer(mainContainer);

    const titleContainer = new UIContainer({
      name: "titleContainer",
      width: 32 * 12,
      height: 75,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    titleContainer.addChild(new TitleTextElement());
    mainContainer.addChildContainer(titleContainer);

    const instructionsContainer = new UIContainer({
      name: "instructionsContainer",
      width: 350,
      height: 175,
      padding: {
        topPadding: 20,
        bottomPadding: 0,
        leftPadding: 5,
        rightPadding: 0,
      },
      gap: 0,
      pos: vec(16, 250),
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });

    instructionsContainer.addChild(new InstructionsElement());
    mainContainer.addChildContainer(instructionsContainer);

    const buttonContainer = new UIContainer({
      name: "buttonContainer",
      width: 32 * 12,
      height: 75,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    buttonContainer.addChild(new Startbutton());
    mainContainer.addChildContainer(buttonContainer);

    //this.add(new TitleTextElement());
    //this.add(new Startbutton());

    //this.add(levelMap);
    this.add(new StaticLayer());
  }
}
