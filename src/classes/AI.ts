import { SHOOT_MODIFIER } from '../data/gameSettings';
import CircularObject from './CircularObject';

class AI extends CircularObject {
  shoot() {
    let ball = this.gameInstance.getBall();
    let maxDistortions = 20;

    let aiAndBallDistanceX = this.x - ball.x;
    let aiAndBallDistanceY = this.y - ball.y;

    aiAndBallDistanceX += this.getRandomInt(maxDistortions * -1, maxDistortions);
    aiAndBallDistanceY += this.getRandomInt(maxDistortions * -1, maxDistortions);

    let shootX = aiAndBallDistanceX * SHOOT_MODIFIER * -1;
    let shootY = aiAndBallDistanceY * SHOOT_MODIFIER * -1;

    let cappedVelocities = this.getCappedVelocities(shootX, shootY);

    this.vx = cappedVelocities.vx;
    this.vy = cappedVelocities.vy;

    this.gameInstance.resetTurnInterval();
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}

export default AI;
