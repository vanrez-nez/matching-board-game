import Vec2 from './Vec2';

export const DIRECTIONS = {
  Left: [-1, 0],
  Right: [1, 0],
  Up: [0, -1],
  Down: [0, 1],
};

export default class Grid {
  constructor({ rows, cols }) {
    this.rows = rows;
    this.cols = cols;
    this.slots = this.createSlots();
  }

  createSlots() {
    const { rows, cols } = this;
    const arr = [];
    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < rows; x++) {
        arr.push(new Vec2(x, y));
      }
    }
    return arr;
  }

  walk(slotPivot, direction, callback) {
    const [dirX, dirY] = direction;
    let offset = 1;
    let slot = null;
    do {
      const [x, y] = [dirX * offset, dirY * offset];
      slot = this.getSlotOffset(slotPivot, x, y);
      if (slot) {
        if (callback(slot)) {
          return;
        }
        offset++;
      }
    } while (slot)
  }

  getNeighbor(slot, direction) {
    const [dx, dy] = direction;
    const x = slot.x + dx;
    const y = slot.y + dy;
    if (this.isValidSlot(x, y)) {
      return this.getSlotOffset(slot, dx, dy);
    }
  }

  getCrossNeighbors(slotPivot) {
    const result = { Left: [], Right: [], Up: [], Down: [] };
    for (let key in DIRECTIONS) {
      this.walk(slotPivot, DIRECTIONS[key], (p) => {
          result[key].push(p);
      });
    }
    return result;
  }

  getSlotOffset(pivot, offsetX, offsetY) {
    const { x, y } = pivot;
    return this.getSlotAt(x + offsetX, y + offsetY);
  }

  getSlotEdge(pivot, dir) {
    const { Left, Right, Up, Down } = DIRECTIONS;
    const { cols, rows } = this;
    switch(dir) {
      case Left: return this.getSlotAt(0, pivot.y);
      case Right: return this.getSlotAt(cols - 1, pivot.y);
      case Up: return this.getSlotAt(pivot.x, 0);
      case Down: return this.getSlotAt(pivot.x, rows - 1);
    }
  }

  directionBetween(slotA, slotB) {
    const { Left, Right, Up, Down } = DIRECTIONS;
    if (slotA.x > slotB.x) return Right;
    if (slotA.x < slotB.x) return Left;
    if (slotA.y > slotB.y) return Down;
    if (slotA.y < slotB.y) return Up;
  }

  invertDirection(dir) {
    const { Left, Right, Up, Down } = DIRECTIONS;
    switch(dir) {
      case Left: return Right;
      case Right: return Left;
      case Up: return Down;
      case Down: return Up;
    }
  }

  isValidSlot(x, y) {
    return (x < this.rows && y < this.cols && x >= 0 && y >= 0);
  }

  getSlotAt(x, y) {
    if (!this.isValidSlot(x, y)) return null;
    return this.slots[y * this.rows + x];
  }

  get length() {
    return this.rows * this.cols;
  }
}