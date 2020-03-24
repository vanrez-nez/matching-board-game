import { gsap, Back, Bounce } from 'gsap';
import Vec2 from "./Vec2";
import Color from "./Color";

const COLORS = [
  new Color().fromHex(0xF60000),
  new Color().fromHex(0xFF8C00),
  new Color().fromHex(0xFFEE00),
  new Color().fromHex(0x4DE94C),
  new Color().fromHex(0x3783FF),
  new Color().fromHex(0x4815AA),
];

const COLOR_LOCKED = new Color().fromHex(0x454147);

let PieceId = 0;

export default class BoardPiece {
  constructor({ type, slot, size, locked = false, power = 1 }) {
    this.type = type;
    this.slot = slot;
    this.id = PieceId++;
    this.position = new Vec2();
    this.size = size;
    this.power = power;
    this.isHover = false;
    this.locked = locked;
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
    const { isHover, size, power, locked, type } = this;
    const { x, y } = this.position;
    const color = locked ? COLOR_LOCKED : COLORS[type];
    context.beginPath();
    context.fillStyle = isHover ? color.toHSLString(0, 10, 10) : color.toHSLString();
    context.fillRect(x, y, size, size);
    context.strokeStyle = isHover ? color.toHSLString(0, 20, 40) : color.toHSLString(0, 10, 20);
    context.rect(x, y, size - 1, size - 1);
    context.stroke();
    context.closePath();
    if (power > 1) {
      context.fillStyle = 'rgba(255, 255, 255, 0.7)';
      context.font = 'italic 18px Arial';
      context.textAlign = 'center';
      context.fillText(`x${power}`, x + size / 2, y + size / 2);
    }
  }

  clone() {
    const { type, slot, size, locked, power } = this;
    return new BoardPiece({ type, slot, size, locked, power });
  }

}