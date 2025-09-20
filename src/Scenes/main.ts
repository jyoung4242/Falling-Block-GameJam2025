import { Engine, PostProcessor, Scene, SceneActivationContext } from "excalibur";
import { levelMap, levelMapCenter } from "../Actors/level";
import { BlockManager } from "../Lib/block manager";
import { FillActor } from "../Actors/fillActor";
import { Exit } from "../Actors/exit";
import { Player } from "../Actors/player";
import { SideWall } from "../Actors/sideWall";
import { StaminaMeter } from "../ScreenElements/StaminaMeter";
import { Signal } from "../Lib/Signals";
import { gameRNG, shockWavePP, soundManager } from "../main";
import { StaticLayer } from "../Actors/staticLayer";

export class mainScene extends Scene {
  gameLevel: number = 0;
  blockManager: BlockManager = new BlockManager(this.engine);
  pp: PostProcessor | null = null;
  changeTimeSignal = new Signal("changeTime");
  analyticsSignal = new Signal("setAnalytics");
  song: "level2Song" | "level3Song" | "level4Song" = "level3Song";
  sm: StaminaMeter | null = null;
  constructor() {
    super();
  }

  onActivate(context: SceneActivationContext<unknown>): void {
    //reset logic
    this.gameLevel++;
    this.blockManager.reset(this.gameLevel);
    this.entities.find(e => e instanceof Player)?.reset();
    this.normalTime();
    if (this.sm) this.sm.reset();
    this.analyticsSignal.send(["ROUND", "CURRENTLEVEL", 1]); //adds one to level

    //play one of the 4 level songs
    let songnum = gameRNG.integer(1, 4);
    this.song = `level${songnum}Song` as "level2Song" | "level3Song" | "level4Song";
    soundManager.play(this.song);
  }
  onDeactivate(context: SceneActivationContext): void {
    soundManager.stop(this.song);
  }

  onInitialize(engine: Engine): void {
    //this.add(levelMap);
    this.add(new StaticLayer());
    engine.currentScene.camera.pos = levelMapCenter;
    engine.currentScene.camera.pos.x = levelMapCenter.x;
    this.blockManager.regScene(this);
    this.blockManager.isActive = true;

    this.add(new FillActor());
    this.add(new Exit());
    this.add(new Player());
    this.add(new SideWall("left"));
    this.add(new SideWall("right"));

    //UI
    this.sm = new StaminaMeter();
    this.add(this.sm);

    this.changeTimeSignal.listen((evt: CustomEvent) => {
      const params = evt.detail.params;
      if (params[0] === "slow") this.slowTime();
      if (params[0] === "normal") this.normalTime();
    });
    shockWavePP.init(this);
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    this.blockManager.update(elapsed);
  }

  slowTime() {
    this.engine.timescale = 0.2;
  }

  normalTime() {
    this.engine.timescale = 1;
  }
}
