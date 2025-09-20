// resources.ts
import { FontSource, ImageSource, Loader, Sound, SpriteSheet } from "excalibur";
import block1 from "./Assets/Graphics/Block1.png";
import block2 from "./Assets/Graphics/Block2.png";
import block3 from "./Assets/Graphics/Block3.png";
import block4 from "./Assets/Graphics/Block4.png";
import floor from "./Assets/Graphics/Floor.png";
import exit from "./Assets/Graphics/exit.png";
import squirrelSS from "./Assets/Graphics/Squirrel Sprite Sheet.png";

import rock1 from "./Assets/Graphics/rocks/Horror_Stone_01-128x128.png";
import rock2 from "./Assets/Graphics/rocks/Horror_Stone_02-128x128.png";
import rock3 from "./Assets/Graphics/rocks/Horror_Stone_03-128x128.png";
import rock4 from "./Assets/Graphics/rocks/Horror_Stone_04-128x128.png";
import rock5 from "./Assets/Graphics/rocks/Horror_Stone_05-128x128.png";
import rock6 from "./Assets/Graphics/rocks/Horror_Stone_06-128x128.png";
import rock7 from "./Assets/Graphics/rocks/Horror_Stone_07-128x128.png";
import rock8 from "./Assets/Graphics/rocks/Horror_Stone_08-128x128.png";
import rock9 from "./Assets/Graphics/rocks/Horror_Stone_09-128x128.png";
import rock10 from "./Assets/Graphics/rocks/Horror_Stone_10-128x128.png";
import rock11 from "./Assets/Graphics/rocks/Horror_Stone_11-128x128.png";
import rock12 from "./Assets/Graphics/rocks/Horror_Stone_12-128x128.png";
import rock13 from "./Assets/Graphics/rocks/Horror_Stone_13-128x128.png";
import rock14 from "./Assets/Graphics/rocks/Horror_Stone_14-128x128.png";

import StartButtonUp from "./Assets/Graphics/ButtonUp.png";
import RestartButtonUp from "./Assets/Graphics/RESTARTBUTTONUP.png";
import squirrelCursor from "./Assets/Graphics/squirrelCursorsmall.png";
import container from "./Assets/Graphics/Container.png";

import vectroidFont from "./Assets/Fonts/Vipnagorgialla Rg.otf";
import map from "./Assets/Graphics/map.png";

//music
import titlesong from "./Assets/Sound/bgm/Title.ogg";
import eolsong from "./Assets/Sound/bgm/eol.ogg";
import gameoversong from "./Assets/sound/bgm/GAMEOVER.ogg";
import l1song from "./Assets/Sound/bgm/LEVEL1.ogg";
import l2song from "./Assets/Sound/bgm/LEVEL2.ogg";
import l3song from "./Assets/Sound/bgm/LEVEL3.ogg";
import l4song from "./Assets/Sound/bgm/LEVEL4.ogg";

export const Resources = {
  Block1: new ImageSource(block1),
  Block2: new ImageSource(block2),
  Block3: new ImageSource(block3),
  Block4: new ImageSource(block4),
  Floor: new ImageSource(floor),
  Exit: new ImageSource(exit),
  SquirrelSS: new ImageSource(squirrelSS),
  rock1: new ImageSource(rock1),
  rock2: new ImageSource(rock2),
  rock3: new ImageSource(rock3),
  rock4: new ImageSource(rock4),
  rock5: new ImageSource(rock5),
  rock6: new ImageSource(rock6),
  rock7: new ImageSource(rock7),
  rock8: new ImageSource(rock8),
  rock9: new ImageSource(rock9),
  rock10: new ImageSource(rock10),
  rock11: new ImageSource(rock11),
  rock12: new ImageSource(rock12),
  rock13: new ImageSource(rock13),
  rock14: new ImageSource(rock14),
  StartButtonUp: new ImageSource(StartButtonUp),
  RestartButtonUp: new ImageSource(RestartButtonUp),
  squirrelCursor: new ImageSource(squirrelCursor),
  container: new ImageSource(container),
  vectroidFont: new FontSource(vectroidFont, "Vectroid"),
  map: new ImageSource(map),
  tilesong: new Sound(titlesong),
  eolsong: new Sound(eolsong),
  gameoversong: new Sound(gameoversong),
  l2song: new Sound(l2song),
  l3song: new Sound(l3song),
  l4song: new Sound(l4song),
};

export const SquirrelSpriteSheet = SpriteSheet.fromImageSource({
  image: Resources.SquirrelSS,
  grid: {
    rows: 7,
    columns: 8,
    spriteWidth: 32,
    spriteHeight: 32,
  },
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
