import BoardPiece from './BoardPiece'
import BoardWalker, { DIRECTIONS } from './BoardWalker';

export default class Board {
  constructor(width, height, cellSize) {
    this.pieces = [];
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.walker = new BoardWalker(this);
  }

  generate() {
    const { width, height, cellSize: size } = this;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const type = Math.floor(Math.random() * 3);
        const piece = new BoardPiece({ type, size, x, y });
        this.pieces.push(piece);
      }
    }
  }

  snapToGrid(x, y) {
    const xOut = Math.floor(x / this.cellSize);
    const yOut = Math.floor(y / this.cellSize);
    return [xOut, yOut];
  }

  getPieceAt(x, y) {
    const { height, width } = this;
    if (x > width - 1 || y > height - 1 || x < 0 || y < 0) return null;
    return this.pieces[y * width + x];
  }

  activatePieceAt(x, y) {
    const { walker } = this;
    const piece = this.getPieceAt(x, y);
    if (!piece) return;
    walker.setPivot(x, y);
    for (let key in DIRECTIONS) {
      walker.walk(DIRECTIONS[key], (p) => {
        if (piece.type === p.type) {
          p.test = true;
          console.log(piece);
        }
      });
    }
  }

  reset() {
    this.pieces = [];
    this.generate();
  }
}