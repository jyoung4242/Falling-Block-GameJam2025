import { Actor, CollisionType, Engine, vec } from "excalibur";
import {
  playerDyingLeft,
  playerDyingRight,
  playerFallingLeft,
  playerFallingRight,
  playerIdle1AnimLeft,
  playerIdle1AnimRight,
  playerIdle2AnimLeft,
  playerIdle2AnimRightt,
  playerJumpingLeft,
  playerJumpingRight,
  playerRunAnimLeft,
  playerRunAnimRight,
} from "../Animations/playerAnimations";
import { Signal } from "../Lib/Signals";
import { playercolliderGroup } from "../colliderGroups";
import { KeyBoardControlComponent } from "../Components/KeyboardInputComponent";
import { AnimationComponent } from "../Components/AnimationComponent";
import { TouchingComponent } from "../Components/TouchingComponent";
import { Block } from "./block";
import { shockWavePP, sndPlugin, STARTING_POINT } from "../main";

const PLAYER_GLOW_RADIUS = 50;
const GRAVITY = 450;
const JUMP_HEIGHT = -300;

export class Player extends Actor {
  activeBlockCollisions: Block[] = [];
  gpad = new Signal("gamepad");
  shockwaveSignal = new Signal("shockwave");
  analyticsSignal = new Signal("setAnalytics");
  currentStamina = 100;
  maxStamina = 100;
  //   isFalling = true;
  maxVel = 450;
  maxVelX = 75;
  playerUpdateSignal = new Signal("playerUpdate");
  changeTimeSignal = new Signal("changeTime");
  fillLevel = new Signal("fillLevel");
  currentFillLevel = 0;
  heightPercentage = 0;
  updateStaminaSignal: Signal = new Signal("updateStamina");
  tc: TouchingComponent = new TouchingComponent();
  kc: KeyBoardControlComponent;
  ac: AnimationComponent<
    | "idle1Right"
    | "idle2Right"
    | "idle1Left"
    | "idle2Left"
    | "runRight"
    | "runLeft"
    | "jumpRight"
    | "jumpLeft"
    | "fallRight"
    | "fallLeft"
    | "deadRight"
    | "deadLeft"
  >;
  isRunning = false;
  isUsingGamepad = false;
  direction: "left" | "right" = "right";
  isJumping = false;
  isHittingWallLeft = false;
  isHittingWallRight = false;
  isHittingBlockFromAbove = false;
  oldIsOnGround = false; // for playing landing sound
  isOnGround = false;
  isFalling = true;
  isSpaceHeld = false;
  isDrowning = false;
  isDead = false;
  hasUsedWallJump = false;

  lStick: "left" | "right" | "idle" = "idle";
  gpadButton: "pressed" | "released" = "released";

  constructor() {
    super({
      x: STARTING_POINT.x, //32 * 7,
      y: STARTING_POINT.y, //32 * 12,
      radius: 8,
      anchor: vec(0.5, 0.75),
      z: 14,
      scale: vec(2, 2),
      collisionGroup: playercolliderGroup,
      collisionType: CollisionType.Passive,
    });
    this.body.mass = 1;
    this.acc = vec(0, 100);
    this.kc = new KeyBoardControlComponent();
    this.kc.init();
    this.ac = new AnimationComponent({
      idle1Right: playerIdle1AnimRight,
      idle2Right: playerIdle2AnimRightt,
      idle1Left: playerIdle1AnimLeft,
      idle2Left: playerIdle2AnimLeft,
      runRight: playerRunAnimRight,
      runLeft: playerRunAnimLeft,
      jumpRight: playerJumpingRight,
      jumpLeft: playerJumpingLeft,
      fallRight: playerFallingRight,
      fallLeft: playerFallingLeft,
      deadRight: playerDyingRight,
      deadLeft: playerDyingLeft,
    });

    this.addComponent(this.kc);
    this.addComponent(this.ac);
    this.addComponent(this.tc);
    this.ac.set("idle1Right");
    this.fillLevel.listen((params: CustomEvent) => {
      this.currentFillLevel = params.detail.params[0];
    });
    this.gpad.listen((params: CustomEvent) => {
      let stickInterface = params.detail.params[1];
      let value = params.detail.params[2];

      if (stickInterface == "leftStick") {
        this.lStick = value;
      }
      if (stickInterface == "buttonPressed" && value == 0) {
        //jump
        this.gpadButton = "pressed";
      } else if (stickInterface == "buttonReleased" && value == 0) {
        //released
        this.gpadButton = "released";
      }
    });
  }

  reset() {
    this.currentStamina = this.maxStamina;
    this.updateStaminaSignal.send([this.currentStamina]);
    this.pos = STARTING_POINT;
    this.updateStaminaSignal.send([this.currentStamina]);
    this.isDead = false;
    this.ac.set("idle1Right");
    this.isRunning = false;
    this.direction = "right";
    this.isJumping = false;
    this.isHittingWallLeft = false;
    this.isHittingWallRight = false;
    this.isHittingBlockFromAbove = false;
    this.isOnGround = false;
    this.isFalling = true;
    this.isSpaceHeld = false;
    this.isDrowning = false;
    this.isDead = false;
    this.hasUsedWallJump = false;
  }

  onPreUpdate(engine: Engine, elapsed: number): void {
    this.heightPercentage = 1.0 - this.pos.y / engine.screen.height;

    if (this.isDead) {
      this.vel.x = 0;
      this.vel.y = 0;
      this.acc.y = 0;
      if (this.ac.isAnimationDone()) {
        this.changeTimeSignal.send(["normal"]);
        this.scene?.engine.goToScene("eol", { sceneActivationData: { status: "lose" } });
      } else return;
    }

    if (this.heightPercentage < this.currentFillLevel) {
      this.isDrowning = true;
      this.currentStamina -= 5.0;
      this.updateStaminaSignal.send([this.currentStamina]);
    } else {
      this.isDrowning = false;
    }
    let jumpRequest = false;
    //check gamepad

    if (this.lStick == "left") {
      this.isUsingGamepad = true;
      this.isRunning = true;
      this.direction = "left";
    } else if (this.lStick == "right") {
      this.isUsingGamepad = true;
      this.isRunning = true;
      this.direction = "right";
    }

    if (this.isUsingGamepad && this.lStick == "idle") {
      this.isRunning = false;
    }

    if (this.gpadButton == "pressed") {
      this.isUsingGamepad = true;
      jumpRequest = true;
      this.isSpaceHeld = true;
    } else {
      this.isSpaceHeld = false;
    }

    //check keyboard control  -> controls isRunning and isJumping/isFalling
    if (this.kc.keys.length > 0 && !this.isUsingGamepad) {
      if (this.kc.keys.includes("ArrowLeft") || this.kc.keys.includes("KeyA")) {
        this.isRunning = true;
        this.direction = "left";
      }
      if (this.kc.keys.includes("ArrowRight") || this.kc.keys.includes("KeyD")) {
        this.isRunning = true;
        this.direction = "right";
      }
      if (this.kc.keys.includes("Space") && !this.isSpaceHeld) {
        jumpRequest = true;
        this.isSpaceHeld = true;
      }

      if (!this.kc.keys.includes("Space")) {
        this.isSpaceHeld = false;
      }
      //check for both keys not pressed
      if (
        !(this.kc.keys.includes("ArrowLeft") || this.kc.keys.includes("KeyA")) &&
        !(this.kc.keys.includes("ArrowRight") || this.kc.keys.includes("KeyD"))
      ) {
        this.isRunning = false;
      }
    } else {
      //no key pressed
      if (!this.isUsingGamepad) {
        this.isRunning = false;
        this.isSpaceHeld = false;
      }
    }

    // check collisions -> isOnGround, isHittingWall
    this.isOnGround = this.tc.bottom.size > 0;

    if (this.isOnGround != this.oldIsOnGround) {
      this.oldIsOnGround = this.isOnGround;
      if (this.isOnGround) {
        sndPlugin.playSound("landing");
      }
    }

    this.isHittingWallLeft = this.tc.left.size > 0;
    this.isHittingWallRight = this.tc.right.size > 0;
    this.isHittingBlockFromAbove = this.tc.top.size > 0;
    let canWalljUMP = (this.isHittingWallLeft || this.isHittingWallRight) && !this.isOnGround;

    //manage velocity - Left/Right
    if (this.isRunning) {
      if (this.direction == "left") {
        if (this.isHittingWallLeft) {
          this.acc.x = 0;
          this.vel.x = 0;
        } else {
          this.acc.x = -450;
        }
      } else if (this.direction == "right") {
        if (this.isHittingWallRight) {
          this.acc.x = 0;
          this.vel.x = 0;
        } else {
          this.acc.x = 450;
        }
      }
    } else {
      //slow down
      this.acc.x = 0;
      this.vel.x *= 0.9; //friction
      //test for close to zero
      if (Math.abs(this.vel.x) < 5) this.vel.x = 0;
    }

    //manage velocity - Jumping/Falling/standing on ground
    if (this.isOnGround) {
      this.hasUsedWallJump = false;
      this.isFalling = false;
      this.isJumping = false;
      this.acc.y = 0;
      this.vel.y = 0;
      if (jumpRequest && this.currentStamina > 5) {
        sndPlugin.playSound("jump");
        this.analyticsSignal.send(["ROUND", "NUMJUMPS", 1]);
        this.currentStamina -= 5;
        this.updateStaminaSignal.send([this.currentStamina]);
        this.vel.y = JUMP_HEIGHT;
        this.acc.y = GRAVITY;
        this.isJumping = true;
        this.isFalling = false;
      }
    } else {
      this.acc.y = GRAVITY;

      if (canWalljUMP && jumpRequest && !this.hasUsedWallJump && this.currentStamina > 10) {
        sndPlugin.playSound("walljump");
        this.analyticsSignal.send(["ROUND", "NUMWALLJUMPS", 1]);
        this.currentStamina -= 10;
        this.updateStaminaSignal.send([this.currentStamina]);
        this.vel.y = JUMP_HEIGHT;
        this.acc.y = GRAVITY;
        this.isJumping = true;
        this.isFalling = false;
        this.hasUsedWallJump = true;
      }

      //monitor the jumpingstate, if y moves from negative to positive -> falling
      if (this.vel.y >= 0) {
        this.isFalling = true;
        this.acc.y = GRAVITY * 1.25;
      }
      if (this.vel.y < 0) {
        this.isJumping = true;
        this.isFalling = false;
      }
    }

    if (this.isHittingBlockFromAbove) {
      //get rock from tc

      let rocks = this.tc.top;
      let rockArray = Array.from(rocks);
      let rockIsInActiveBuffer = this.activeBlockCollisions.some(rock => rock == rockArray[0]);

      if (rockArray[0] instanceof Block && !rockArray[0].blockState && !rockIsInActiveBuffer) {
        this.currentStamina -= 25;
        //clamp stamina
        this.currentStamina = Math.min(this.currentStamina, 100);
        this.currentStamina = Math.max(0, this.currentStamina);
        this.updateStaminaSignal.send([this.currentStamina]);
      }

      if (rockArray[0] instanceof Block) this.vel.y = this.maxVel;
    } else this.activeBlockCollisions = [];

    //maxVelcheck
    if (this.vel.y > this.maxVel) this.vel.y = this.maxVel;
    if (this.vel.x > this.maxVelX) this.vel.x = this.maxVelX;
    if (this.vel.x < -this.maxVelX) this.vel.x = -this.maxVelX;

    //manage animations
    if (this.isRunning && this.isOnGround) {
      if (this.direction == "left") {
        this.ac.set("runLeft");
      } else {
        this.ac.set("runRight");
      }
    } else if (this.isJumping && !this.isFalling) {
      if (this.direction == "left") {
        this.ac.set("jumpLeft");
      } else {
        this.ac.set("jumpRight");
      }
    } else if (this.isFalling) {
      if (this.direction == "left") {
        this.ac.set("fallLeft");
      } else {
        this.ac.set("fallRight");
      }
    } else {
      //idle
      if (this.direction == "left") {
        this.ac.set("idle1Left");
      } else {
        this.ac.set("idle1Right");
      }

      //stamina charging here
      if (this.currentStamina < this.maxStamina && !this.isDrowning) {
        this.currentStamina += 0.05;
        if (this.currentStamina > this.maxStamina) this.currentStamina = this.maxStamina;
        this.updateStaminaSignal.send([this.currentStamina]);
      }
    }

    if (this.currentStamina <= 0 && !this.isDead) {
      sndPlugin.playSound("death");
      this.changeTimeSignal.send(["slow"]);
      this.isDead = true;
      let animation: "deadLeft" | "deadRight" = this.direction == "left" ? "deadLeft" : "deadRight";
      this.ac.set(animation);
    }

    this.playerUpdateSignal.send([vec(this.pos.x, this.pos.y + 16), PLAYER_GLOW_RADIUS]);
  }
}
