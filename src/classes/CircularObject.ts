import CircularObjectInterface from '../interfaces/CircularObjectInterface';
import GameObject from './GameObject';

class CircularObject extends GameObject {
  public radius!: number;

  constructor(gameInstance: any, objectProperties: CircularObjectInterface) {
    super(gameInstance, objectProperties);
    Object.assign(this, objectProperties);
  }

  draw() {
    this.drawShape();
    if (this.isUnderClick) this.drawForceLine();
  }

  drawShape() {
    this.gameInstance.context.beginPath();
    this.gameInstance.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.gameInstance.context.fillStyle = this.color;
    this.gameInstance.context.fill();
  }

  checkIfPointWithinObject(pointX: number, pointY: number) {
    if (
      this.x - this.radius <= pointX &&
      this.x + this.radius >= pointX &&
      this.y - this.radius <= pointY &&
      this.y + this.radius >= pointY
    )
      return true;

    return false;
  }
}

export default CircularObject;
