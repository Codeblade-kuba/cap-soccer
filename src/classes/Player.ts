import CircularObject from './CircularObject';

class Player extends CircularObject {
  checkIfPlayerTurn() {
    if (this.gameInstance.turn === 0) return true;
    return false;
  }

  onClick() {
    if (!this.checkIfPlayerTurn()) return;

    this.isUnderClick = true;
    this.changeColor('black');
    this.addEventListeners();
  }

  onClickEnd() {
    this.isUnderClick = false;
    this.resetColor();
    this.removeEventListeners();
  }

  onMouseUp() {
    this.shoot();
    this.onClickEnd();
  }

  addEventListeners() {
    this.onMouseUp = this.onMouseUp.bind(this);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  removeEventListeners() {
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}

export default Player;
