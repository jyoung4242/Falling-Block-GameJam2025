import { Color, ExcaliburGraphicsContext, Graphic, ScreenElement, Vector } from "excalibur";
import { AnalyticsKey } from "../Lib/analytics";
import { Resources } from "../resources";
import { drawText } from "canvas-txt";

type ContainerType = "round" | "game" | "alltime";

export class InstructionsElement extends ScreenElement {
  constructor() {
    super({
      pos: Vector.Zero,
      width: 384,
      height: 100,
      color: Color.Black,
      z: 20,
    });
    this.addChild(new TitleText());
    this.graphics.use(Resources.container.toSprite().clone());
  }
}

export class TitleText extends ScreenElement {
  textToRender: string = ``;
  textGraphic: TextGraphic;
  constructor() {
    let myPos: Vector = Vector.Zero;
    super({
      pos: Vector.Zero,
      width: 384,
      height: 120,
      color: Color.Black,
      z: 20,
    });
    this.textGraphic = new TextGraphic();
    this.graphics.use(this.textGraphic);
  }
}

class TextGraphic extends Graphic {
  textToRender: string = `

  HOW TO PLAY

  Left/Right: A or D, Left/Right arrows
  Jump: Space or X button
  Pause: BackTik \` key  
  Mute: Foreward Slash / key
  WallJump: Jump while against wall
  /block`;

  constructor() {
    super({
      width: 384,
      height: 175,
    });
  }

  clone(): Graphic {
    return new TextGraphic();
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    let cnv = document.createElement("canvas");
    let ctx = cnv.getContext("2d");
    cnv.width = 400;
    cnv.height = 175;
    if (!ctx) return;
    ctx.fillStyle = "#83a923";
    drawText(ctx, this.textToRender, {
      font: "Vectroid",
      x: 22,
      y: 0,
      width: 400,
      height: 120,
      fontSize: 14,
      align: "left",
      fontStyle: "normal",
    });
    ex.drawImage(cnv, x, y);
  }
}
