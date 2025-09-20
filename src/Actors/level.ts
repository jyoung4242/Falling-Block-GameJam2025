import { Color, Graphic, ImageSource, Resource, TileMap, TileMapOptions, vec, Vector } from "excalibur";
import { gameRNG } from "../main";
import { Resources } from "../resources";

const tmapOptions: TileMapOptions = {
  columns: 12,
  rows: 25,
  tileHeight: 32,
  tileWidth: 32,
};

export const levelMap: TileMap = new TileMap(tmapOptions);

export const levelMapCenter: Vector = vec(levelMap.width / 2, levelMap.height / 2);

export function initializeMap() {
  let tileIndex = 0;
  for (let tile of levelMap.tiles) {
    // assign graphics

    let isLeftEdge = tileIndex % levelMap.columns === 0;
    let isRightEdge = tileIndex % levelMap.columns === levelMap.columns - 1;
    let isBottomRow = tileIndex >= levelMap.tiles.length - levelMap.columns;
    let thisTile, sprite;

    if (isBottomRow) {
      sprite = Resources.Floor.toSprite();
      tile.solid = true;
      tile.addGraphic(sprite);
    } /* else if (isLeftEdge || isRightEdge) {
      thisTile = gameRNG.pickOne(["1", "2", "3", "4"]);
      sprite = Resources[`Block${thisTile}` as keyof typeof Resources].toSprite().clone();
      tile.solid = true;
      tile.addGraphic(sprite); 
    } */ else {
      thisTile = gameRNG.pickOne(["1", "2", "3", "4"]);
      sprite = Resources[`Block${thisTile}` as keyof typeof Resources].toSprite().clone();
      tile.solid = false;
      tile.addGraphic(sprite);
    }

    tileIndex++;
  }
  levelMap.z = -1;
}
