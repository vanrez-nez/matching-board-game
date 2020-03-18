import Vec2 from "./Vec2";
import Color from "./Color";

const COLORS = [
  0x29c7ac,
  0xffd868,
  0xfe346e,
];

export default class BoardPiece {
  constructor({ type, col, row, size }) {
    this.type = type;
    this.col = col;
    this.row = row;
    this.color = new Color().fromHex(COLORS[type]);
    this.size = size;
    this.position = new Vec2();
    this.positionFrom = new Vec2();
    this.positionTo = new Vec2();
    this.positionProgress = 1;
    this.isHover = false;
    this.moveTo(col, row);
  }

  updateAnimation() {
    const { toPosition, fromPosition } = this;

  }

  moveTo(col, row, animate = false) {
    const { size, position, positionFrom, positionTo } = this;
    const toX = row * size;
    const toY = col * size;
    if (animate) {
      positionFrom.copy(position);
      positionTo.set(toX, toY);
      this.positionProgress = 0;
    } else {
      position.set(toX, toY);
      positionFrom.copy(position);
      positionTo.copy(position);
      this.positionProgress = 1;
    }
  }

  update() {
    this.updateAnimation();
  }

  draw(context) {
    const { isHover, size, color } = this;
    const { x, y } = this.position;
    context.beginPath();
    context.fillStyle = isHover ? color.toHSLString(0, 10, 10) : color.toHSLString();
    context.fillRect(x, y, size, size);
    context.strokeStyle = isHover ? color.toHSLString(0, 20, 40) : color.toHSLString(0, 10, 20);
    context.rect(x, y, size - 1, size - 1);
    context.stroke();
    context.closePath();
  }
}