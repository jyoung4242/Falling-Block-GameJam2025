import { Color, ExcaliburGraphicsContext, Graphic, GraphicOptions, ScreenElement, Vector } from "excalibur";
import { drawText } from "canvas-txt";

export class TitleTextElement extends ScreenElement {
  constructor() {
    super({
      color: Color.Transparent,
      z: 20,
      width: 400,
      height: 100,
      pos: new Vector(0, 50),
    });
    this.graphics.use(new TitleTextGraphics());
  }
}

let config: GraphicOptions = {
  width: 400,
  height: 100,
};

class TitleTextGraphics extends Graphic {
  textToRender: string = "ESCAPE THE WELL";
  constructor() {
    super(config);
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    let cnv = document.createElement("canvas");
    let ctx = cnv.getContext("2d");
    cnv.width = 400;
    cnv.height = 100;
    if (!ctx) return;
    ctx.fillStyle = "#83a923";
    ctx.strokeStyle = "#dddddd";
    drawText(ctx, this.textToRender, {
      font: "Vectroid",
      x: 0,
      y: 0,
      width: 400,
      height: 100,
      fontSize: 48,
      align: "center",
      fontStyle: "bold",
    });
    ex.drawImage(cnv, x, y);
  }

  clone(): TitleTextGraphics {
    return new TitleTextGraphics();
  }
}
