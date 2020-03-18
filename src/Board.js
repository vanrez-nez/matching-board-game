
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
        const piece = new BoardPiece({ type, size, cellX: x, cellY: y });
        this.pieces.push(piece);
      }
    }
  }

  snapToGrid(x, y) {
    const xOut = Math.floor(x / this.cellSize);
    const yOut = Math.floor(y / this.cellSize);
    return [xOut, yOut];
  }

  isValidCell(x, y) {
    return (x < this.width && y < this.height && x >= 0 && y >= 0);
  }

  getPieceAt(x, y) {
    if (!this.isValidCell(x, y)) return null;
    return this.pieces[y * this.width + x];
  }

  setPieceAt(x, y, piece) {
    if (!this.isValidCell(x, y)) {
      console.warn('Invalid board position:', x, y, piece);
      return false;
    }
    this.pieces[y * this.width + x] = piece;
  }

  movePiece(piece, cellX, cellY) {
    this.setPieceAt(piece.cellX, piece.cellY, null);
    piece.moveTo(cellX, cellY, true);
    this.setPieceAt(cellX, cellY, piece);
  }

  async mergePieces(fromPiece, toPiece, dir) {
    //console.log('Shifting Piece', fromPiece, dir);
    //this.movePiece(fromPiece, toPiece.cellX, toPiece.cellY);
    //this.setPieceAt(fromPiece.cellX, fromPiece.cellY, null);
    await fromPiece.moveTo(toPiece.cellX, toPiece.cellY, true);

  }

  shiftPiece(piece, direction) {
    const [ shiftX, shiftY ] = direction;
    const targetX = piece.cellX + shiftX;
    const targetY = piece.cellY + shiftY;
    this.movePiece(piece, targetX, targetY);
  }

  activatePieceAt(x, y) {
    const { walker } = this;
    const piece = this.getPieceAt(x, y);
    if (!piece) return;
    const crossNeighbors = walker.getCrossNeighbors(piece);
    console.log(crossNeighbors);
    for (let dir in crossNeighbors) {
      const neighbors = crossNeighbors[dir];
      let attract = false;
      for (let i = 0; i < neighbors.length; i++) {
        const current = neighbors[i];
        const shiftDir = walker.invertDirection(DIRECTIONS[dir]);
        if (i === 0 && current.type === piece.type) {
          this.mergePieces(current, piece, shiftDir);
          attract = true;
        } else if (attract) {
          //console.log(current, shiftDir);
          this.shiftPiece(current, shiftDir);
        }
      }
    }
    console.log(this);
  }

  reset() {
    this.pieces = [];
    this.generate();
  }
}