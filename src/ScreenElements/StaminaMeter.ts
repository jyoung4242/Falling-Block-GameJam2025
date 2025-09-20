import { Actor, Engine, ExcaliburGraphicsContext, Graphic, GraphicsGroup, ScreenElement, Sprite, vec } from "excalibur";
import { Resources } from "../resources";
import { Signal } from "../Lib/Signals";

export class StaminaMeter extends ScreenElement {
  currentStamina: number = 100;
  nextStamina: number = 100;
  maxStamina: number = 100;
  updateStaminaSignal: Signal = new Signal("updateStamina");
  updateTik: number = 0;
  updateTikLimit: number = 2;
  graphicsGroup: GraphicsGroup;
  squirrelCursor: Sprite;
  constructor() {
    super({ x: 2, y: 0, width: 6, height: 32 * 25, z: 100 });
    this.updateStaminaSignal.listen((evt: CustomEvent) => {
      const params = evt.detail.params;
      this.nextStamina = params[0]; // + for increase, - for decrease
      //clamp nextStamina
      this.nextStamina = Math.min(this.nextStamina, 100);
      this.nextStamina = Math.max(0, this.nextStamina);
    });
    this.squirrelCursor = Resources.squirrelCursor.toSprite().clone();
    this.squirrelCursor.scale = vec(0.75, 0.75);
    this.graphicsGroup = new GraphicsGroup({
      useAnchor: false,
      members: [new StaminaMeterGraphic(this), { offset: vec(0, 745), graphic: this.squirrelCursor }],
    });
    this.graphics.use(this.graphicsGroup);
    this.graphics.opacity = 0.9;
  }

  onInitialize(engine: Engine): void {}

  reset() {
    this.currentStamina = 100;
    this.nextStamina = 100;
  }

  get stamina() {
    let percent = this.currentStamina / this.maxStamina;
    return percent;
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    if (this.nextStamina == this.currentStamina) return;

    if (this.nextStamina > this.currentStamina) this.currentStamina += 0.25;
    if (this.nextStamina < this.currentStamina) this.currentStamina -= 0.25;
  }
}

const BARHEIGHT = 745;

class StaminaMeterGraphic extends Graphic {
  parent: StaminaMeter;
  constructor(parent: StaminaMeter) {
    super({ width: 16, height: 32 * 25 });
    this.parent = parent;
  }

  clone(): StaminaMeterGraphic {
    return new StaminaMeterGraphic(this.parent);
  }

  protected _drawImage(ex: ExcaliburGraphicsContext, x: number, y: number): void {
    //get current stamina
    const currentStamina = this.parent.stamina;

    const cnv = document.createElement("canvas");
    const ctx = cnv.getContext("2d");
    cnv.width = 8;
    cnv.height = BARHEIGHT;
    if (!ctx) return;
    // Draw background
    // background
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // fill based on percent
    const fillHeight = cnv.height * Math.max(0, Math.min(currentStamina, 1));
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(0, cnv.height - fillHeight, cnv.width, fillHeight);
    ex.drawImage(cnv, x, y);
  }
}
