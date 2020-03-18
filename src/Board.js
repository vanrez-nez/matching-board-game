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
        const type = Math.floor(Math.random() * 3);
        const piece = new BoardPiece({ type, size, col, row });
        this.pieces.push(piece);
      }
    }
  }

  snapToGrid(x, y) {
    const xSnap = Math.floor(x / this.cellSize);
    const ySnap = Math.floor(y / this.cellSize);
    return [xSnap, ySnap];
  }

  getPieceAt(col, row) {
    const { cols } = this;
    return this.pieces[col * cols + row];
  }

  reset() {
    this.pieces = [];
    this.generate();
  }
}