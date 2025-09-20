import { Actor, CollisionType, Color, Engine, Material, Shader, vec } from "excalibur";
import { waterfill } from "../Shaders/waterfill";
import { Signal } from "../Lib/Signals";

export class FillActor extends Actor {
  isfilling: boolean = false;
  fillSignal = new Signal("fill");
  fillLevel = new Signal("fillLevel");
  material: Material | null = null;
  fillAmount: number = 0;
  fillTime: number = 0;
  fillTimeLimit: number = 200000;
  waterColor: Color = Color.fromHex("#7b943bff");
  waterOpacity: number = 0.75;
  pauseSignal = new Signal("pause");
  isPaused: boolean = false;

  constructor() {
    super({
      z: 12,
      pos: vec(-32, 0),
      width: 32 * 14,
      height: 32 * 25,
      color: Color.Transparent,
      anchor: vec(0, 0),
      collisionType: CollisionType.PreventCollision,
    });

    this.fillSignal.listen((params: CustomEvent) => {
      let paramsData = params.detail.params;

      this.isfilling = paramsData[0];
      if (paramsData[0]) this.fillTimeLimit = paramsData[1];
      this.fillAmount = 0;
      this.fillTime = 0;
      this.fillLevel.send([this.fillAmount]);
      this.material?.update((s: Shader) => {
        s.trySetUniformFloat("u_fillAmount", this.fillAmount);
        s.trySetUniformFloatColor("u_waterColor", this.waterColor);
        s.trySetUniformFloat("u_waterOpacity", this.waterOpacity);
        s.setUniformFloat("u_waveAmplitude", 0.005);
        s.trySetUniformFloat("u_waveFrequency", 30.0);
        s.trySetUniformFloat("u_waveSpeed", 4.0);
        s.trySetUniformFloat("u_noiseAmplitude", 0.005); // subtle noise
      });
    });

    this.pauseSignal.listen((evt: CustomEvent) => {
      this.isPaused = evt.detail.params[0];
    });
  }

  onInitialize(engine: Engine): void {
    this.material = engine.graphicsContext.createMaterial({
      fragmentSource: waterfill,
    });
    if (!this.material) return;
    this.graphics.material = this.material;

    // initial uniform setup
    this.material.update(s => {
      s.trySetUniformFloatVector("u_resolution", vec(this.width, this.height));
    });
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    if (this.isPaused) return;
    if (!this.material) return;
    if (this.isfilling) {
      this.fillTime += elapsed;
      this.fillAmount = this.fillTime / this.fillTimeLimit;
      this.fillLevel.send([this.fillAmount]);
      this.material?.update((s: Shader) => {
        s.trySetUniformFloat("u_fillAmount", this.fillAmount);
        s.trySetUniformFloatColor("u_waterColor", this.waterColor);
        s.trySetUniformFloat("u_waterOpacity", this.waterOpacity);
        s.setUniformFloat("u_waveAmplitude", 0.005);
        s.trySetUniformFloat("u_waveFrequency", 30.0);
        s.trySetUniformFloat("u_waveSpeed", 4.0);
        s.trySetUniformFloat("u_noiseAmplitude", 0.005); // subtle noise
      });
    }
  }
}
