import { Color, Engine, Scene, SceneActivationContext, ScreenElement } from "excalibur";
import { EndOfLevelText } from "../ScreenElements/EndOfLevelText";
import { RestartButton } from "../ScreenElements/StartButton";
import { levelMap } from "../Actors/level";
import { Signal } from "../Lib/Signals";
import { UILayout, UIContainer } from "../Lib/UILayout";
import { EOLDataContainer } from "../ScreenElements/EOLDataContainer";
import { AnalyticsKey } from "../Lib/analytics";
import { StaticLayer } from "../Actors/staticLayer";
import { soundManager } from "../main";

export class EndOfLevel extends Scene {
  textGraphic: EndOfLevelText | null = null;
  layout: UILayout | null = null;
  roundData = {};
  gameData = {};
  alltimeData = {};
  requestAnalyticsSignal = new Signal("requestAnalytics");
  publishedAnalyticsSignal = new Signal("publishedAnalytics");
  saveSignal = new Signal("saveAnalytics");
  gpad = new Signal("gamepad");
  resetButton: RestartButton | null = null;

  roundDataContainer: ScreenElement | null = null;
  gameDataContainer: ScreenElement | null = null;
  alltimeDataContainer: ScreenElement | null = null;
  song: "gameOverSong" | "eolSong" = "eolSong";

  constructor() {
    super();
    this.publishedAnalyticsSignal.listen((evt: CustomEvent) => {
      this.roundData = evt.detail.params[0];
      this.gameData = evt.detail.params[1];
      this.alltimeData = evt.detail.params[2];
      // console.log("END OF ROUND", this.roundData, this.gameData, this.alltimeData);
      //update screen text when ready
      if (this.roundDataContainer)
        (this.roundDataContainer as EOLDataContainer).updateText(this.roundData as Record<keyof typeof AnalyticsKey, number>);
      if (this.gameDataContainer)
        (this.gameDataContainer as EOLDataContainer).updateText(this.gameData as Record<keyof typeof AnalyticsKey, number>);
      if (this.alltimeDataContainer)
        (this.alltimeDataContainer as EOLDataContainer).updateText(this.alltimeData as Record<keyof typeof AnalyticsKey, number>);
    });
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
      positionContentStrategy: "anchor-start",
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
    titleContainer.addChild(new EndOfLevelText());
    mainContainer.addChildContainer(titleContainer);

    const endOfRoundContainer = new UIContainer({
      name: "endOfRoundContainer",
      width: 350,
      height: 175,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    // console.log(this.roundData);

    this.roundDataContainer = new EOLDataContainer("round", this.roundData as Record<keyof typeof AnalyticsKey, number>);
    endOfRoundContainer.addChild(this.roundDataContainer);
    mainContainer.addChildContainer(endOfRoundContainer);

    const currentGameContainer = new UIContainer({
      name: "currentGameContainer",
      width: 350,
      height: 175,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    this.gameDataContainer = new EOLDataContainer("game", this.roundData as Record<keyof typeof AnalyticsKey, number>);
    currentGameContainer.addChild(this.gameDataContainer);
    mainContainer.addChildContainer(currentGameContainer);

    const alltimeContainer = new UIContainer({
      name: "alltimeContainer",
      width: 350,
      height: 175,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    this.alltimeDataContainer = new EOLDataContainer("alltime", this.gameData as Record<keyof typeof AnalyticsKey, number>);
    alltimeContainer.addChild(this.alltimeDataContainer);
    mainContainer.addChildContainer(alltimeContainer);

    const buttonContainer = new UIContainer({
      name: "buttonContainer",
      width: 384,
      height: 64,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "center",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    const buttonPlacementContainer = new UIContainer({
      name: "buttonContainer",
      width: 128,
      height: 64,
      padding: 0,
      gap: 0,
      layoutDirection: "horizontal",
      positionContentStrategy: "fixed",
      alignmentContentStrategy: "center",
      color: Color.Transparent,
    });
    buttonContainer.addChildContainer(buttonPlacementContainer);
    this.resetButton = new RestartButton();
    buttonPlacementContainer.addChild(this.resetButton);
    mainContainer.addChildContainer(buttonContainer);

    //this.add(levelMap);
    this.add(new StaticLayer());
  }

  onActivate(context: SceneActivationContext<{ status: "win" | "lose" }>) {
    this.requestAnalyticsSignal.send([context.data!.status]);
    if (context.data!.status === "lose") {
      this.textGraphic?.updateText("Game Over");
      soundManager.play("gameOverSong");
    } else {
      this.textGraphic?.updateText("End of Level");
      soundManager.play("eolSong");
    }

    this.gpad.listen((evt: CustomEvent) => {
      let gpadInterface = evt.detail.params[1];
      let gpadValue = evt.detail.params[2];
      if (gpadInterface == "buttonPressed" && gpadValue == 0) {
        if (context.data!.status === "lose") context.engine.goToScene("main", { sceneActivationData: { newGame: true } });
        else context.engine.goToScene("main", { sceneActivationData: { newGame: false } });
      }
    });
  }

  onDeactivate(context: SceneActivationContext) {
    soundManager.stop("eolSong");
    soundManager.stop("gameOverSong");
    this.gpad.stopListening();
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    this.layout?.update();
  }
}
