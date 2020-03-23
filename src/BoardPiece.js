import { gsap, Back, Bounce } from 'gsap';
import Vec2 from "./Vec2";
import Color from "./Color";

const COLORS = [
  0xF60000,
  0xFF8C00,
  0xFFEE00,
  0x4DE94C,
  0x3783FF,
  0x4815AA,
];

let PieceId = 0;

export default class BoardPiece {
  constructor({ type, slot, size }) {
    this.type = type;
    this.slot = slot;
    this.id = PieceId++;
    this.position = new Vec2();
    this.color = new Color().fromHex(COLORS[type]);
    this.size = size;
    this.isHover = false;
    this.moveTo(slot);
  }

  async fallTo(slotTo) {
    return this.moveTo(slotTo, true, Back.easeOut);
  }

  async shiftTo(slotTo) {
    return this.moveTo(slotTo, true, Back.easeInOut);
  }

  async moveTo(slotTo, animate = false, easing = Back.easeIn) {
    const { size, position } = this;
    return new Promise((done) => {
      if (animate) {
        gsap.to(position, 0.3, {
          x: slotTo.x * size,
          y: slotTo.y * size,
          ease: easing,
          onComplete: done,
        });
      } else {
        position.set(slotTo.x * size, slotTo.y * size);
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

  clone() {
    const { type, slot, size } = this;
    return new BoardPiece({ type, slot, size });
  }

}