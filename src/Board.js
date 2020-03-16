import BoardPiece from './BoardPiece'

export default class Board {
  constructor(rows, cols, cellSize) {
    this.pieces = [];
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
  }

  generate() {
    const { rows, cols, cellSize: size } = this;
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const type = Math.floor(Math.random() * 2);
        const piece = new BoardPiece({ type, size, col, row });
        this.pieces.push(piece);
      }
    }
  }

  reset() {
    this.pieces = [];
    this.generate();
  }
}