import { Animation, AnimationStrategy } from "excalibur";
import { SquirrelSpriteSheet } from "../resources";

//  Animation rows in the sprite sheet
//  0      1        2       3      4      5        6
// Idle, idle2, movement,  dig,   eat,  damage,  death

export const playerIdle1AnimRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [
    { x: 0, y: 0, duration: 200, options: {} },
    { x: 1, y: 0, duration: 200, options: {} },
    { x: 2, y: 0, duration: 200, options: {} },
    { x: 3, y: 0, duration: 200, options: {} },
    { x: 4, y: 0, duration: 200, options: {} },
    { x: 5, y: 0, duration: 200, options: {} },
  ],
  strategy: AnimationStrategy.Loop,
});

export const playerIdle2AnimRightt = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [
    { x: 0, y: 1, duration: 200, options: {} },
    { x: 1, y: 1, duration: 200, options: {} },
    { x: 2, y: 1, duration: 200, options: {} },
    { x: 3, y: 1, duration: 200, options: {} },
    { x: 4, y: 1, duration: 200, options: {} },
    { x: 5, y: 1, duration: 200, options: {} },
  ],
  strategy: AnimationStrategy.Loop,
});

export const playerIdle1AnimLeft = playerIdle1AnimRight.clone();
playerIdle1AnimLeft.flipHorizontal = true;

export const playerIdle2AnimLeft = playerIdle2AnimRightt.clone();
playerIdle2AnimLeft.flipHorizontal = true;

export const playerRunAnimRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [
    { x: 0, y: 2, duration: 125, options: {} },
    { x: 1, y: 2, duration: 125, options: {} },
    { x: 2, y: 2, duration: 125, options: {} },
    { x: 3, y: 2, duration: 125, options: {} },
    { x: 4, y: 2, duration: 125, options: {} },
    { x: 5, y: 2, duration: 125, options: {} },
    { x: 6, y: 2, duration: 125, options: {} },
    { x: 7, y: 2, duration: 125, options: {} },
  ],
  strategy: AnimationStrategy.Loop,
});
export const playerRunAnimLeft = playerRunAnimRight.clone();
playerRunAnimLeft.flipHorizontal = true;

export const playerFallingRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [{ x: 3, y: 2, duration: 200, options: {} }],
  strategy: AnimationStrategy.Loop,
});

export const playerFallingLeft = playerFallingRight.clone();
playerFallingLeft.flipHorizontal = true;

export const playerJumpingRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [
    { x: 0, y: 2, duration: 200, options: {} },
    { x: 1, y: 2, duration: 200, options: {} },
    { x: 2, y: 2, duration: 200, options: {} },
  ],
  strategy: AnimationStrategy.Freeze,
});

export const playerJumpingLeft = playerJumpingRight.clone();
playerJumpingLeft.flipHorizontal = true;

export const playerDyingRight = Animation.fromSpriteSheetCoordinates({
  spriteSheet: SquirrelSpriteSheet,
  frameCoordinates: [
    { x: 0, y: 6, duration: 75, options: {} },
    { x: 1, y: 6, duration: 75, options: {} },
    { x: 2, y: 6, duration: 75, options: {} },
    { x: 3, y: 6, duration: 75, options: {} },
  ],
  strategy: AnimationStrategy.Freeze,
});

export const playerDyingLeft = playerDyingRight.clone();
playerDyingLeft.flipHorizontal = true;
