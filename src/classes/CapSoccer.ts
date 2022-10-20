import defaultGameObjects from '../data/defaultGameObjects';
import Ball from './Ball';
import Player from './Player';
import AI from './AI';
import { SCREEN_X, SCREEN_Y, TURN_DURATION } from '../data/gameSettings';
import circleIntersect from '../utils/circleIntersect';

class CapSoccer {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public uniqueId = 0;
  public turn: 0 | 1 = 0;
  public turnInterval = 0;
  public lastTurnTimestamp = new Date().getTime();
  public mouseX: number = 0;
  public mouseY: number = 0;

  protected gameObjects: (Ball | Player | AI)[] = [];
  protected matchResult: [number, number] = [0, 0];

  constructor(canvasSelector: string) {
    this.canvas = document.querySelector(canvasSelector)!;
    this.context = this.canvas.getContext('2d')!;

    this.init();
  }

  init() {
    this.setupGameObjects();
    this.setupListeners();
    this.setupTurnInterval();
    this.callGameLoopOnNextFrame();
  }

  setupGameObjects() {
    defaultGameObjects.map((gameObject) => {
      let gameObjectInstance: Ball | Player | AI;

      switch (gameObject.type) {
        case 'BALL':
          gameObjectInstance = new Ball(this, gameObject);
          break;
        case 'PLAYER':
          gameObjectInstance = new Player(this, gameObject);
          break;
        default:
          gameObjectInstance = new AI(this, gameObject);
          break;
      }

      this.gameObjects.push(gameObjectInstance);
    });
  }

  setupListeners() {
    window.addEventListener('mousedown', (e) => this.dispatchCallbackWhenPlayerClicked(e));
    window.addEventListener('mousemove', (e) => this.updateMouseCoordinates(e));
  }

  dispatchCallbackWhenPlayerClicked(e: MouseEvent) {
    this.gameObjects.map((gameObject) => {
      if (gameObject instanceof Player && gameObject.checkIfPointWithinObject(e.offsetX, e.offsetY))
        gameObject.onClick();
    });
  }

  updateMouseCoordinates(e: MouseEvent) {
    console.log(e);
    this.mouseX = e.clientX - this.canvas.offsetLeft;
    this.mouseY = e.clientY - this.canvas.offsetTop;
  }

  callGameLoopOnNextFrame() {
    window.requestAnimationFrame(() => this.gameLoop());
  }

  gameLoop() {
    this.drawField();
    this.drawScoreBoard();
    this.drawTurnIndicator();
    this.detectCollisions();
    this.updateGameObjects();
    this.drawGameObjects();

    this.callGameLoopOnNextFrame();
  }

  drawField() {
    // Background
    this.context.fillStyle = '#326d26';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Grass
    this.context.fillStyle = '#56ab46';
    this.context.fillRect(50, 0, this.canvas.width - 100, this.canvas.height);

    // Lines settings
    this.context.strokeStyle = '#ffffff';
    this.context.fillStyle = '#ffffff';
    this.context.lineWidth = 5;

    // Outlines
    this.context.beginPath();
    this.context.moveTo(50, 2.5);
    this.context.lineTo(this.canvas.width - 50, 2.5);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(this.canvas.width - 50, 0);
    this.context.lineTo(this.canvas.width - 50, this.canvas.height);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(50, this.canvas.height - 2.5);
    this.context.lineTo(this.canvas.width - 50, this.canvas.height - 2.5);
    this.context.stroke();

    this.context.beginPath();
    this.context.moveTo(50, 0);
    this.context.lineTo(50, this.canvas.height);
    this.context.stroke();

    // Center line
    this.context.beginPath();
    this.context.moveTo(this.canvas.width / 2, 0);
    this.context.lineTo(this.canvas.width / 2, this.canvas.height);
    this.context.stroke();

    // Ball dot
    this.context.beginPath();
    this.context.arc(this.canvas.width / 2, this.canvas.height / 2, 8, 0, 2 * Math.PI);
    this.context.fill();

    // Ball circle
    this.context.beginPath();
    this.context.arc(this.canvas.width / 2, this.canvas.height / 2, 40, 0, 2 * Math.PI);
    this.context.stroke();

    // Left goal area
    this.context.beginPath();
    this.context.moveTo(50, this.canvas.height / 2 - 150);
    this.context.lineTo(150, this.canvas.height / 2 - 150);
    this.context.lineTo(150, this.canvas.height / 2 + 150);
    this.context.lineTo(50, this.canvas.height / 2 + 150);
    this.context.stroke();

    // Left penalty area
    this.context.beginPath();
    this.context.moveTo(50, this.canvas.height / 2 - 300);
    this.context.lineTo(300, this.canvas.height / 2 - 300);
    this.context.lineTo(300, this.canvas.height / 2 + 300);
    this.context.lineTo(50, this.canvas.height / 2 + 300);
    this.context.stroke();

    // Right goal area
    this.context.beginPath();
    this.context.moveTo(this.canvas.width - 50, this.canvas.height / 2 - 150);
    this.context.lineTo(this.canvas.width - 150, this.canvas.height / 2 - 150);
    this.context.lineTo(this.canvas.width - 150, this.canvas.height / 2 + 150);
    this.context.lineTo(this.canvas.width - 50, this.canvas.height / 2 + 150);
    this.context.stroke();

    // Right penalty Area
    this.context.beginPath();
    this.context.moveTo(this.canvas.width - 50, this.canvas.height / 2 - 300);
    this.context.lineTo(this.canvas.width - 300, this.canvas.height / 2 - 300);
    this.context.lineTo(this.canvas.width - 300, this.canvas.height / 2 + 300);
    this.context.lineTo(this.canvas.width - 50, this.canvas.height / 2 + 300);
    this.context.stroke();

    // Nets settings
    this.context.lineWidth = 2;
    let verticalNetDensity = 5;
    let horizontalNetDensity = 28;

    // Left goal net
    for (let i = 0; i <= horizontalNetDensity; i += 1) {
      this.context.beginPath();
      this.context.moveTo(0, this.canvas.height / 2 - 150 + (300 / horizontalNetDensity) * i);
      this.context.lineTo(50, this.canvas.height / 2 - 150 + (300 / horizontalNetDensity) * i);
      this.context.stroke();
    }

    for (let i = 0; i <= verticalNetDensity; i += 1) {
      this.context.beginPath();
      this.context.moveTo(0 + (50 / verticalNetDensity) * i, this.canvas.height / 2 - 150);
      this.context.lineTo(0 + (50 / verticalNetDensity) * i, this.canvas.height / 2 + 150);
      this.context.stroke();
    }

    // Right goal net
    for (let i = 0; i <= horizontalNetDensity; i += 1) {
      this.context.beginPath();
      this.context.moveTo(this.canvas.width, this.canvas.height / 2 - 150 + (300 / horizontalNetDensity) * i);
      this.context.lineTo(this.canvas.width - 50, this.canvas.height / 2 - 150 + (300 / horizontalNetDensity) * i);
      this.context.stroke();
    }

    for (let i = 0; i <= verticalNetDensity; i += 1) {
      this.context.beginPath();
      this.context.moveTo(this.canvas.width - (50 / verticalNetDensity) * i, this.canvas.height / 2 - 150);
      this.context.lineTo(this.canvas.width - (50 / verticalNetDensity) * i, this.canvas.height / 2 + 150);
      this.context.stroke();
    }
  }

  drawScoreBoard() {
    let scoreBoardDefaults = {
      x: 200,
      y: 70,
      fontSize: 30,
      color: '#000000',
      backgroundColor: '#ffffff',
    };

    this.context.fillStyle = scoreBoardDefaults.backgroundColor;
    this.context.fillRect(
      this.canvas.width / 2 - scoreBoardDefaults.x / 2,
      0,
      scoreBoardDefaults.x,
      scoreBoardDefaults.y
    );
    this.context.fillStyle = scoreBoardDefaults.color;
    this.context.font = `${scoreBoardDefaults.fontSize}px Arial`;
    this.context.textAlign = 'center';
    this.context.fillText(
      `${this.matchResult[0]} : ${this.matchResult[1]}`,
      this.canvas.width / 2,
      scoreBoardDefaults.y / 2 + scoreBoardDefaults.fontSize / 2
    );
  }

  drawTurnIndicator() {
    let turnIndicatorDefaults = {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      fillColor: 'rgba(255, 0, 0, 0.5)',
      width: 160,
      height: 30,
      margin: 20,
    };

    let marginXToApply =
      this.turn === 0
        ? turnIndicatorDefaults.margin
        : SCREEN_X - turnIndicatorDefaults.width - turnIndicatorDefaults.margin;

    const currentDate = new Date();

    this.context.fillStyle = turnIndicatorDefaults.backgroundColor;
    this.context.fillRect(
      marginXToApply,
      turnIndicatorDefaults.margin,
      turnIndicatorDefaults.width,
      turnIndicatorDefaults.height
    );
    this.context.fillStyle = turnIndicatorDefaults.fillColor;
    this.context.fillRect(
      marginXToApply,
      turnIndicatorDefaults.margin,
      (1 - (currentDate.getTime() - this.lastTurnTimestamp) / TURN_DURATION) * turnIndicatorDefaults.width,
      turnIndicatorDefaults.height
    );
  }

  detectCollisions() {
    let currentObj;
    let comparedObject;

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].isColliding = false;
    }

    for (let i = 0; i < this.gameObjects.length; i++) {
      currentObj = this.gameObjects[i];
      for (let j = i + 1; j < this.gameObjects.length; j++) {
        comparedObject = this.gameObjects[j];

        if (
          circleIntersect(
            currentObj.x,
            currentObj.y,
            currentObj.radius,
            comparedObject.x,
            comparedObject.y,
            comparedObject.radius
          )
        ) {
          currentObj.isColliding = true;
          comparedObject.isColliding = true;

          // "Distance on x axis and distance on y axis"
          let vCollision = {
            x: comparedObject.x - currentObj.x,
            y: comparedObject.y - currentObj.y,
          };

          // Distance between two center points of circle
          let distance = Math.sqrt(Math.pow(vCollision.x, 2) + Math.pow(vCollision.y, 2));

          // Ratio between collision direction and radius on x and y axis (my explanation)
          let vCollisionNorm = {
            x: vCollision.x / distance,
            y: vCollision.y / distance,
          };

          // Resulting velocities on x and y from collision
          let vRelativeVelocity = {
            x: currentObj.vx - comparedObject.vx,
            y: currentObj.vy - comparedObject.vy,
          };

          // Calculating summary speed before collision involving axis velocities times normalized collision vector
          let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

          if (speed < 0) {
            break;
          }

          let impulse = (2 * speed) / (currentObj.mass + comparedObject.mass);
          currentObj.vx -= impulse * comparedObject.mass * vCollisionNorm.x;
          currentObj.vy -= impulse * comparedObject.mass * vCollisionNorm.y;
          comparedObject.vx += impulse * currentObj.mass * vCollisionNorm.x;
          comparedObject.vy += impulse * currentObj.mass * vCollisionNorm.y;
        }
      }

      // Wall collisions

      if (
        currentObj.type === 'BALL' &&
        currentObj.y > SCREEN_Y / 2 - 150 &&
        currentObj.y < SCREEN_Y / 2 + 150 &&
        currentObj.x + currentObj.radius >= SCREEN_X - 50
      ) {
        this.goal(0);
      } else if (
        currentObj.type === 'BALL' &&
        currentObj.y > SCREEN_Y / 2 - 150 &&
        currentObj.y < SCREEN_Y / 2 + 150 &&
        currentObj.x - currentObj.radius <= 50
      ) {
        this.goal(1);
      } else {
        if (currentObj.x - currentObj.radius <= 50 || currentObj.x + currentObj.radius >= SCREEN_X - 50) {
          currentObj.vx *= -1;
        }

        if (currentObj.y - currentObj.radius <= 0 || currentObj.y + currentObj.radius >= SCREEN_Y) {
          currentObj.vy *= -1;
        }
      }
    }
  }

  goal(scorerTeamIndex: number) {
    this.matchResult[scorerTeamIndex] += 1;
    this.resetGameObjectPositions();
  }

  resetGameObjectPositions() {
    this.gameObjects.map((gameObject, index) => {
      gameObject.x = defaultGameObjects[index].x;
      gameObject.y = defaultGameObjects[index].y;
      gameObject.vx = 0;
      gameObject.vy = 0;
    });
  }

  updateGameObjects() {
    return this.gameObjects.map((gameObject) => gameObject.update());
  }

  drawGameObjects() {
    return this.gameObjects.map((gameObject) => gameObject.draw());
  }

  getUniqueId() {
    let uniqueId = this.uniqueId;
    this.uniqueId += 1;

    return uniqueId;
  }

  setupTurnInterval() {
    this.turnInterval = window.setInterval(() => this.changeTurn(), TURN_DURATION);
  }

  clearTurnInterval() {
    window.clearInterval(this.turnInterval);
  }

  resetTurnInterval() {
    this.clearTurnInterval();
    this.changeTurn();
    this.setupTurnInterval();
  }

  changeTurn() {
    this.terminatePlayersOnClick();
    this.toggleNextTurn();
    this.updateTurnTimestamp();
    if (this.turn === 1) {
      setTimeout(() => {
        this.gameObjects[2].shoot();
      }, Math.random() * TURN_DURATION);
    }
  }

  terminatePlayersOnClick() {
    this.gameObjects.map((gameObject) => {
      if (gameObject instanceof Player) gameObject.onClickEnd();
    });
  }

  toggleNextTurn() {
    this.turn === 0 ? (this.turn = 1) : (this.turn = 0);
  }

  updateTurnTimestamp() {
    const currentDate = new Date();
    this.lastTurnTimestamp = currentDate.getTime();
  }

  getBall() {
    let ball: Ball | null = null;
    this.gameObjects.map((gameObject) => {
      if (gameObject.type === 'BALL') ball = gameObject;
    });
    return ball;
  }
}

export default CapSoccer;
