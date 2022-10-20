import GameObjectType from '../interfaces/GameObjectInterface';
import { FRICTION, MAX_SHOOT_VELOCITY, SHOOT_MODIFIER } from '../data/gameSettings';

class GameObject {
  public id;
  public gameInstance;

  public type!: string;
  public x!: number;
  public y!: number;
  public vx!: number;
  public vy!: number;
  public mass!: number;
  public color!: string;
  public defaultColor: string;
  public isUnderClick: boolean;
  public isColliding: boolean;

  constructor(gameInstance: any, objectProperties: GameObjectType) {
    this.gameInstance = gameInstance;
    this.id = this.gameInstance.getUniqueId();
    Object.assign(this, objectProperties);
    this.defaultColor = this.color;
    this.isUnderClick = false;
    this.isColliding = false;
  }

  update() {
    this.reduceVelocityWithFriction();
    this.move();
  }

  reduceVelocityWithFriction() {
    this.vx *= FRICTION;
    this.vy *= FRICTION;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  changeColor(color: string) {
    this.color = color;
  }

  resetColor() {
    this.color = this.defaultColor;
  }

  drawForceLine() {
    let x = this.gameInstance.mouseX - this.x;
    let y = this.gameInstance.mouseY - this.y;

    let distance = Math.sqrt(
      Math.pow(this.gameInstance.mouseX - this.x, 2) + Math.pow(this.gameInstance.mouseY - this.y, 2)
    );

    if (distance * SHOOT_MODIFIER > MAX_SHOOT_VELOCITY) {
      distance = MAX_SHOOT_VELOCITY / SHOOT_MODIFIER;
    }

    let direction = Math.atan2(y, x);

    this.gameInstance.context.strokeStyle = 'red';
    this.gameInstance.context.lineWidth = 5;
    this.gameInstance.context.beginPath();
    this.gameInstance.context.moveTo(this.x, this.y);
    this.gameInstance.context.lineTo(this.x - distance * Math.cos(direction), this.y - distance * Math.sin(direction));
    this.gameInstance.context.stroke();
  }

  shoot() {
    let x = this.gameInstance.mouseX - this.x;
    let y = this.gameInstance.mouseY - this.y;

    let vx = x * SHOOT_MODIFIER * -1;
    let vy = y * SHOOT_MODIFIER * -1;

    let cappedVelocities = this.getCappedVelocities(vx, vy);

    this.vx = cappedVelocities.vx;
    this.vy = cappedVelocities.vy;

    this.gameInstance.resetTurnInterval();
  }

  getCappedVelocities(vx: number, vy: number) {
    if (Math.abs(vx) > Math.abs(vy)) {
      let prop = Math.abs(vx / MAX_SHOOT_VELOCITY);
      return {
        vx: MAX_SHOOT_VELOCITY * Math.sign(vx),
        vy: vy / prop,
      };
    } else {
      let prop = Math.abs(vy / MAX_SHOOT_VELOCITY);
      return {
        vx: vx / prop,
        vy: MAX_SHOOT_VELOCITY * Math.sign(vy),
      };
    }
  }
}

export default GameObject;
