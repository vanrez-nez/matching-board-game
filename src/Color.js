import { clamp } from './Utils';

export default class Color {
  constructor(r, g, b) {
    this.hsl = { h: 0, s: 0, l: 0 };
    this.hex = 0x0;
    this.set(r, g, b);
  }

  fromHex(hex) {
    hex = Math.floor( hex );
    this.hex = hex;
    /* eslint-disable no-mixed-operators */
    const r = (hex >> 16 & 255);
    const g = (hex >> 8 & 255);
    const b = ( hex & 255);
    this.set(r, g, b);

    return this;
  }

  set(r = 0, g = 0, b = 0) {
    this.r = r / 255;
    this.g = g / 255;
    this.b = b / 255;

    this.updateHSL();
    return this;
  }

  updateHSL() {
    const { r, g, b, hsl } = this;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;
    let saturation = 0;
    let lightness = (min + max) / 2.0;

    if (min === max) {
      hue = 0;
      saturation = 0;
    } else {
      var delta = max - min;
      saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
      switch (max) {
        case r: hue = (g - b) / delta + (g < b ? 6 : 0); break;
        case g: hue = (b - r) / delta + 2; break;
        case b: hue = (r - g) / delta + 4; break;
        default: break;
      }
      hue /= 6;
    }

    hsl.h = hue;
    hsl.s = saturation;
    hsl.l = lightness;
    return this;
  }

  toHSLString(hueOffset = 0, saturationOffset = 0, lightnessOffset = 0) {
    const { h, s, l } = this.hsl;
    const hStr = clamp(h * 360 + hueOffset, 0, 360);
    const sStr = clamp(s * 100 + saturationOffset, 0, 100);
    const lStr = clamp(l * 100 + lightnessOffset, 0, 100);
    return `hsl(${hStr}, ${sStr}%, ${lStr}%)`;
  }
}