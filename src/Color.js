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
    const r = (hex >> 16 & 255) / 255;
    const g = (hex >> 8 & 255) / 255;
    const b = ( hex & 255) / 255;
    this.set(r, g, b);
    
    return this;
  }

  set(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;

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
    const hStr = (h * 360).toFixed(3) + hueOffset;
    const sStr = (s * 100).toFixed(3) + saturationOffset;
    const lStr = (l * 100).toFixed(3) + lightnessOffset;
    return `hsl(${hStr}, ${sStr}%, ${lStr}%);`;
  }
}