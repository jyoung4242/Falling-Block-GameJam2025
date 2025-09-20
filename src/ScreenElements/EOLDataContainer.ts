import { Color, ExcaliburGraphicsContext, Graphic, ScreenElement, Vector } from "excalibur";
import { AnalyticsKey } from "../Lib/analytics";
import { Resources } from "../resources";
import { drawText } from "canvas-txt";

type ContainerType = "round" | "game" | "alltime";

export class EOLDataContainer extends ScreenElement {
  textToRender: string = ``;
  textChild: EOLDataText;
  convertedTime: string = ``;
  scope: "ROUND" | "GAME" | "ALLTIME";
  constructor(type: ContainerType, data: Record<keyof typeof AnalyticsKey, number>) {
    super({
      pos: Vector.Zero,
      width: 400,
      height: 100,
      color: Color.Black,
      z: 20,
    });

    this.convertedTime = this.formatTime(data.ELAPSEDTIME);
    console.log("time: ", this.convertedTime);
    this.scope = type.toUpperCase() as "ROUND" | "GAME" | "ALLTIME";

    this.textToRender = `
    ${this.scope}

    Current Level: ${data.CURRENTLEVEL}
    Number Blocks Dropped: ${data.NUMBLOCKS}
    Number Jumps: ${data.NUMJUMPS}
    Number Wall Jumps: ${data.NUMWALLJUMPS}
    Elapsed Time: ${this.convertedTime}`;

    this.graphics.use(Resources.container.toSprite().clone());
    this.textChild = new EOLDataText(type, data);
    this.addChild(this.textChild);
    console.log(this.textChild);
    console.log(this.textToRender);
  }

  updateText(data: Record<keyof typeof AnalyticsKey, number>) {
    this.convertedTime = this.formatTime(data.ELAPSEDTIME);
    this.textToRender = `
    ${this.scope}

    Current Level: ${data.CURRENTLEVEL}
    Number Blocks Dropped: ${data.NUMBLOCKS}
    Number Jumps: ${data.NUMJUMPS}
    Number Wall Jumps: ${data.NUMWALLJUMPS}
    Elapsed Time: ${this.convertedTime}`;
    this.textChild.updateText(this.textToRender);
  }

  formatTime(numSeconds: number): string {
    if (!numSeconds) return "0m:00s";
    return `${Math.floor(numSeconds / (60 * 1000)).toFixed(0)}m:${(numSeconds % 60).toFixed(0)}s`;
  }
}

export class EOLDataText extends ScreenElement {
  textToRender: string = ``;
  textGraphic: TextGraphic;
  constructor(type: ContainerType, data: Record<keyof typeof AnalyticsKey, number>) {
    let myPos: Vector = Vector.Zero;
    super({
      pos: Vector.Zero,
      width: 384,
      height: 120,
      color: Color.Black,
      z: 20,
    });
    this.textGraphic = new TextGraphic(this.textToRender);
    this.graphics.use(this.textGraphic);
  }

  updateText(text: string) {
    this.textToRender = text;
    this.textGraphic.updateText(text);
  }
}

class TextGraphic extends Graphic {
  textToRender: string = ``;
  constructor(text: string) {
    super({
      width: 384,
      height: 120,
    });
    this.textToRender = text;
  }

  clone(): Graphic {
    return new TextGraphic(this.textToRender);
  }

  updateText(text: string) {
    this.textToRender = text;
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    let cnv = document.createElement("canvas");
    let ctx = cnv.getContext("2d");
    cnv.width = 400;
    cnv.height = 120;
    if (!ctx) return;
    ctx.fillStyle = "#83a923";
    drawText(ctx, this.textToRender, {
      font: "Vectroid",
      x: 22,
      y: 0,
      width: 400,
      height: 120,
      fontSize: 16,
      align: "left",
      fontStyle: "normal",
    });
    ex.drawImage(cnv, x, y);
  }
}
