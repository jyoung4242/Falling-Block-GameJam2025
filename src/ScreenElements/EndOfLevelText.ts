import { Color, ExcaliburGraphicsContext, Graphic, GraphicOptions, ScreenElement, Vector } from "excalibur";
import { drawText } from "canvas-txt";

export class EndOfLevelText extends ScreenElement {
  graphic: EOLTextGraphics = new EOLTextGraphics("win");
  constructor() {
    super({
      color: Color.Transparent,
      z: 20,
      width: 400,
      height: 100,
      pos: new Vector(0, 0),
    });
    this.graphics.use(this.graphic);
  }
  updateText(text: string) {
    this.graphic.updateText(text);
  }
}

let config: GraphicOptions = {
  width: 400,
  height: 100,
};

class EOLTextGraphics extends Graphic {
  status: "win" | "lose" = "win";
  textToRender: string = "End of Level";
  wintextToRender: string = "End of Level";
  losetextToRender: string = "Game Over";
  constructor(status: "win" | "lose") {
    super(config);
    this.status = status;
    if (status === "win") this.textToRender = this.wintextToRender;
    if (status === "lose") this.textToRender = this.losetextToRender;
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    let cnv = document.createElement("canvas");
    let ctx = cnv.getContext("2d");
    cnv.width = 400;
    cnv.height = 100;
    if (!ctx) return;
    ctx.fillStyle = "#83a923";
    drawText(ctx, this.textToRender, {
      font: "Vectroid",
      x: 0,
      y: 0,
      width: 384,
      height: 100,
      fontSize: 42,
      align: "center",
    });
    ex.drawImage(cnv, x, y);
  }

  updateText(text: string) {
    this.textToRender = text;
  }

  clone(): EOLTextGraphics {
    return new EOLTextGraphics(this.status);
  }
}
