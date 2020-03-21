export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function mod(current, limit) {
  return ( (current % limit) + limit ) % limit;
};

export function rotateAround(centerX, centerY, x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dX = x - centerX;
  const dY = y - centerY;
  const xOut = dX * cos - dY * sin + centerX;
  const yOut = dX * sin + dY * cos + centerY;
  return [xOut, yOut];
}

export function toRadians(degrees) {
  return degrees * Math.PI / 180;
}