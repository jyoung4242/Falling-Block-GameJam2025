import { Engine, Random, Scene, vec } from "excalibur";
import { Block } from "../Actors/block";
import { Signal } from "./Signals";
// import { DropWarning } from "../Actors/warning";

export class BlockManager {
  blockSignal = new Signal("blockLanded");
  blockStopSignal = new Signal("blockStop");
  exitMetSignal = new Signal("exitMet");
  // startNextRoundSignal = new Signal("startNextRound");
  // clearWarningSignal = new Signal("clearWarning");
  analyticsSignal = new Signal("setAnalytics");
  fillSignal = new Signal("fill");
  gameLevel = 0;

  isBlockLanded: boolean = false;
  rng: Random;
  warneringLimit = 2000;
  triggerLimit = 2500;
  triggerTik = 0;
  isActive = false;
  isBlocksDone = false;
  engine: Engine;
  scene: Scene | null = null;
  maxVel = 45;
  nextBlock: Block | null = null;
  //   dropWarning: DropWarning | null = null;

  fillTik = 0;
  fillDelay = 5000;
  fillTimeLimit = 150000;
  isFilling = false;

  constructor(engine: Engine) {
    this.engine = engine;
    this.rng = new Random();

    this.exitMetSignal.listen(() => {
      // round over, stop dropping blocks
      this.isActive = false;
      this.fillTik = 0;
      // clear up all blocks from scene
      const blocks = this.scene?.entities.filter(e => e instanceof Block);
      blocks?.forEach(b => b.kill());
    });

    // this.clearWarningSignal.listen(() => {
    //   //   this.dropWarning = null;
    // });

    // this.startNextRoundSignal.listen(() => {
    //   console.log("start next round");
    //   this.bumpLevel();
    //   this.isActive = true;
    // });

    this.blockSignal.listen(() => {
      if (!this.isBlockLanded) {
        this.isBlockLanded = true;
        setTimeout(() => {
          this.fillSignal.send([true, this.fillTimeLimit]);
        }, this.fillDelay);
      }
    });

    this.blockStopSignal.listen(() => {
      this.isBlocksDone = true;
    });

    let pos = vec(this.rng.integer(-140, 140), -200);
    let seed = this.rng.nextInt();
    this.nextBlock = new Block(pos, seed);
  }

  reset(level: number) {
    this.gameLevel = level;
    this.isBlockLanded = false;
    this.isBlocksDone = false;
    this.triggerTik = 0;
    this.isFilling = false;
    //based on game level, shorten the time between blocks
    // console.log("game progression:", this.gameLevel);

    for (let i = 1; i < this.gameLevel; i++) {
      this.triggerLimit *= 0.95;
      this.maxVel *= 1.05;
      this.fillTimeLimit *= 0.95;
    }
    // console.log("trigger limit:", this.triggerLimit);
    // console.log("max vel:", this.maxVel);
    // console.log("fill time limit:", this.fillTimeLimit);

    this.fillSignal.send([false, this.fillTimeLimit]);
    this.scene?.entities.forEach(e => {
      if (e instanceof Block) {
        e.kill();
      }
    });
  }

  update(elapsed: number) {
    if (this.isActive) {
      this.analyticsSignal.send(["ROUND", "ELAPSEDTIME", elapsed]);
      this.triggerTik += elapsed;
      this.fillTik += elapsed;

      if (this.triggerTik > this.triggerLimit && !this.isBlocksDone) {
        if (!this.scene || !this.nextBlock) return;

        this.scene.add(this.nextBlock);
        this.analyticsSignal.send(["ROUND", "NUMBLOCKS", 1]);
        this.triggerTik = 0;
        let pos = vec(this.rng.integer(64, 384), -200);
        let seed = this.rng.nextInt();
        this.nextBlock = new Block(pos, seed);
      }
    }
  }

  // bumpLevel() {
  //   this.triggerLimit *= 0.9;
  //   this.warneringLimit *= 0.9;
  //   this.triggerTik = 0;
  //   this.maxVel *= 1.1;
  //   this.fillTimeLimit *= 0.9;
  //   this.isFilling = false;
  // }

  regScene(scene: Scene) {
    this.scene = scene;
  }

  set active(v: boolean) {
    this.isActive = v;
  }

  get active() {
    return this.isActive;
  }
}
