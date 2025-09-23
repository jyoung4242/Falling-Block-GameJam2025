import { Signal } from "./Signals";

const AnalyticsScope = {
  ROUND: 0,
  GAME: 1,
  ALLTIME: 2,
} as const;

export const AnalyticsKey = {
  NUMBLOCKS: "NUMBLOCKS",
  NUMJUMPS: "NUMJUMPS",
  NUMWALLJUMPS: "NUMWALLJUMPS",
  ELAPSEDTIME: "ELAPSEDTIME",
  CURRENTLEVEL: "CURRENTLEVEL",
} as const;

type AnalyticsScope = keyof typeof AnalyticsScope;
//    ^ "ROUND" | "GAME" | "ALLTIME"
type AnalyticsKey = keyof typeof AnalyticsKey;

export class GameAnalytics {
  resetGameSignal = new Signal("resetGame");
  saveSignal = new Signal("saveAnalytics");
  analyticsSignal = new Signal("setAnalytics");
  publishedAnalyticsSignal = new Signal("publishedAnalytics");
  requestAnalyticsSignal = new Signal("requestAnalytics");
  currentRound = {
    CURRENTLEVEL: 0,
    NUMBLOCKS: 0,
    NUMJUMPS: 0,
    NUMWALLJUMPS: 0,
    ELAPSEDTIME: 0,
  };
  currentGame = {
    CURRENTLEVEL: 0,
    NUMBLOCKS: 0,
    NUMJUMPS: 0,
    NUMWALLJUMPS: 0,
    ELAPSEDTIME: 0,
  };
  alltime = {
    CURRENTLEVEL: 0,
    NUMBLOCKS: 0,
    NUMJUMPS: 0,
    NUMWALLJUMPS: 0,
    ELAPSEDTIME: 0,
  };

  constructor() {
    this.saveSignal.listen(() => this.saveData());

    this.resetGameSignal.listen(() => this.resetGameData());

    this.requestAnalyticsSignal.listen((evt: CustomEvent) => {
      //Roll up current round into current game and alltime
      let status = evt.detail.params[0];
      this.upDateCurrentGame();
      this.upDateAlltime();
      this.saveData();
      this.publishedAnalyticsSignal.send([this.currentRound, this.currentGame, this.alltime]);
      if (status === "win") this.currentGame.CURRENTLEVEL = this.currentRound.CURRENTLEVEL + 1;
      else this.currentGame.CURRENTLEVEL = this.currentRound.CURRENTLEVEL;
    });

    this.analyticsSignal.listen((evt: CustomEvent) => {
      let key: AnalyticsKey = evt.detail.params[1];
      let value: number = evt.detail.params[2];
      this.currentRound[key] = this.currentRound[key] + value;
    });
  }

  resetGameData() {
    this.currentRound = { CURRENTLEVEL: 0, NUMBLOCKS: 0, NUMJUMPS: 0, NUMWALLJUMPS: 0, ELAPSEDTIME: 0 };
    this.currentGame = { CURRENTLEVEL: 0, NUMBLOCKS: 0, NUMJUMPS: 0, NUMWALLJUMPS: 0, ELAPSEDTIME: 0 };
  }

  resetRound() {
    this.currentRound = { CURRENTLEVEL: 0, NUMBLOCKS: 0, NUMJUMPS: 0, NUMWALLJUMPS: 0, ELAPSEDTIME: 0 };
  }

  logData() {
    console.log("Current Round", this.currentRound);
    console.log("Current Game", this.currentGame);
    console.log("All Time", this.alltime);
  }

  saveData() {
    localStorage.setItem("ETWdata", JSON.stringify(this.alltime));
  }

  loadData() {
    let loadedData = localStorage.getItem("ETWdata");
    if (!loadedData) {
      localStorage.setItem("ETWdata", JSON.stringify(this.alltime));
    } else {
      let parsedData = JSON.parse(loadedData);
      this.currentRound = { CURRENTLEVEL: 0, NUMBLOCKS: 0, NUMJUMPS: 0, NUMWALLJUMPS: 0, ELAPSEDTIME: 0 };
      this.currentGame = { CURRENTLEVEL: 0, NUMBLOCKS: 0, NUMJUMPS: 0, NUMWALLJUMPS: 0, ELAPSEDTIME: 0 };
      if (parsedData) this.alltime = { ...parsedData };
    }
  }

  upDateCurrentGame() {
    this.currentGame = {
      CURRENTLEVEL: this.currentRound.CURRENTLEVEL,
      NUMBLOCKS: this.currentGame.NUMBLOCKS + this.currentRound.NUMBLOCKS,
      NUMJUMPS: this.currentGame.NUMJUMPS + this.currentRound.NUMJUMPS,
      NUMWALLJUMPS: this.currentGame.NUMWALLJUMPS + this.currentRound.NUMWALLJUMPS,
      ELAPSEDTIME: this.currentGame.ELAPSEDTIME + this.currentRound.ELAPSEDTIME,
    };
  }
  upDateAlltime() {
    if (this.alltime.CURRENTLEVEL < this.currentRound.CURRENTLEVEL) this.alltime.CURRENTLEVEL = this.currentRound.CURRENTLEVEL;

    this.alltime = {
      CURRENTLEVEL: this.alltime.CURRENTLEVEL,
      NUMBLOCKS: this.alltime.NUMBLOCKS + this.currentRound.NUMBLOCKS,
      NUMJUMPS: this.alltime.NUMJUMPS + this.currentRound.NUMJUMPS,
      NUMWALLJUMPS: this.alltime.NUMWALLJUMPS + this.currentRound.NUMWALLJUMPS,
      ELAPSEDTIME: this.alltime.ELAPSEDTIME + this.currentRound.ELAPSEDTIME,
    };
  }
}
