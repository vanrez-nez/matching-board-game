export const DIRECTIONS = {
  Left: [-1, 0],
  Right: [1, 0],
  Up: [0, -1],
  Down: [0, 1],
};

export default class BoardWalker {
  constructor(board) {
    this.board = board;
    this.pivotX = 0;
    this.pivotY = 0;
  }

  getPieceOffset(offsetX, offsetY) {
    const { board, pivotX, pivotY } = this;
    return board.getPieceAt(pivotX + offsetX, pivotY + offsetY);
  }

  setPivot(x, y) {
    this.pivotX = x;
    this.pivotY = y;
    return this;
  }

  walk(direction, callback) {
    const [dirX, dirY] = direction;
    let offset = 1;
    let piece = null;
    do {
      const [x, y] = [dirX * offset, dirY * offset];
      piece = this.getPieceOffset(x, y);
      if (piece) {
        callback(piece, offset, direction);
        offset++;
      }
    } while (piece)
  }

  get right() {
    return this.getPieceOffset(1, 0);
  }

  get left() {
    return this.getPieceOffset(-1, 0);
  }

  get up() {
    return this.getPieceOffset(0, -1);
  }

  get down() {
    return this.getPieceOffset(0, 1);
  }
}