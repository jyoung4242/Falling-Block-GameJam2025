// main.ts
import "./style.css";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, Random, Color, vec, SoundManager } from "excalibur";
import { model, template } from "./UI/UI";
import { mainScene } from "./Scenes/main";
import { loader, Resources } from "./resources";
import { EndOfLevel } from "./Scenes/EndOfLevel";
import { IntroScene } from "./Scenes/Intro";
import { ShockWavePostProcessor } from "./Shaders/shockwave";
import { GameAnalytics } from "./Lib/analytics";
import { JsfxrResource } from "@excaliburjs/plugin-jsfxr";
import { sounds } from "./Assets/Sound/sounds";
import { GamepadManager } from "./Lib/GamepadManager";
import { Signal } from "./Lib/Signals";

await UI.create(document.body, model, template).attached;

export const STARTING_POINT = vec(32 * 6, 32 * 20);

const game = new Engine({
  width: 32 * 12, // the width of the canvas  384
  height: 32 * 25, // the height of the canvas 800
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.FitScreen, // the display mode
  pixelArt: true,
  fixedUpdateFps: 60,
  backgroundColor: Color.DarkGray,
  scenes: {
    intro: {
      scene: IntroScene,
    },
    main: {
      scene: mainScene,
    },
    eol: {
      scene: EndOfLevel,
    },
  },
});

let gpManager = new GamepadManager(game);

let globalMuteFlag = false;
export const soundManager = new SoundManager({
  channels: ["music"],
  sounds: {
    titleSong: { sound: Resources.tilesong, volume: 0.2, channels: ["music"], loop: true },
    eolSong: { sound: Resources.eolsong, volume: 0.2, channels: ["music"], loop: true },
    gameOverSong: { sound: Resources.gameoversong, volume: 0.2, channels: ["music"], loop: true },
    level2Song: { sound: Resources.l2song, volume: 0.2, channels: ["music"], loop: true },
    level3Song: { sound: Resources.l3song, volume: 0.2, channels: ["music"], loop: true },
    level4Song: { sound: Resources.l4song, volume: 0.2, channels: ["music"], loop: true },
  },
});

export let sndPlugin = new JsfxrResource();
sndPlugin.init(); //initializes the JSFXR library
for (const sound in sounds) {
  sndPlugin.loadSoundConfig(sound, sounds[sound]);
}

export const gameRNG = new Random();
await game.start(loader);
game.goToScene("intro");

export const shockWavePP = new ShockWavePostProcessor();
game.graphicsContext.addPostProcessor(shockWavePP);

let pauseState = false;
document.addEventListener("keydown", event => {
  if (event.key === "`") {
    pauseState = !pauseState;
    if (pauseState) game.timescale = 0;
    else game.timescale = 1;
  }

  if (event.key === `/`) {
    globalMuteFlag = !globalMuteFlag;
    if (!globalMuteFlag) soundManager.channel.unmute("music");
    else soundManager.channel.mute("music");
  }
});

//initializeMap();
export const gameAnalytics = new GameAnalytics();
gameAnalytics.loadData();
gameAnalytics.logData();
