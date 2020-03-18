import { gsap, Power4 } from 'gsap';
import Vec2 from "./Vec2";
import Color from "./Color";

const COLORS = [
  0x29c7ac,
  0xffd868,
  0xfe346e,
];

export default class BoardPiece {
  constructor({ type, cellX, cellY, size }) {
    this.type = type;
    this.cellX = cellX;
    this.cellY = cellY;
    this.position = new Vec2();
    this.color = new Color().fromHex(COLORS[type]);
    this.size = size;
    this.isHover = false;
    this.moveTo(cellX, cellY);
  }

  async moveTo(destCellX, destCellY, animate = false) {
    const { size, position } = this;
    return new Promise((done) => {
      this.cellX = destCellX;
      this.cellY = destCellY;
      if (animate) {
        gsap.to(position, 0.8, {
          x: destCellX * size,
          y: destCellY * size,
          ease: Power4.easeInOut,
          onComplete: done,
        });
      } else {
        this.position.set(destCellX * size, destCellY * size);
        done();
      }
    });
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