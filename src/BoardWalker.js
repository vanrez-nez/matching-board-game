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
        if (callback(piece)) {
          return;
        }
        offset++;
      }
    } while (piece)
  }

  getCrossNeighbors(piece) {
    const result = { Left: [], Right: [], Up: [], Down: [] };
    this.setPivot(piece.cellX, piece.cellY);
    for (let key in DIRECTIONS) {
      this.walk(DIRECTIONS[key], (p) => {
          result[key].push(p);
      });
    }
    return result;
  }

  invertDirection(dir) {
    switch(dir) {
      case DIRECTIONS.Left: return DIRECTIONS.Right;
      case DIRECTIONS.Right: return DIRECTIONS.Left;
      case DIRECTIONS.Up: return DIRECTIONS.Down;
      case DIRECTIONS.Down: return DIRECTIONS.Up;
    }
  }
}