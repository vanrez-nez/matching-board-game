import { DIRECTIONS } from './Grid';
import Grid from './Grid';
import BoardPiece from './BoardPiece';

export default class Board {
  constructor({ rows, cols, cellSize }) {
    this.cellSize = cellSize;
    this.grid = new Grid({ rows, cols });
    this.pieces = [];
    this.map = null;
  }

  loadRandomMap() {
    const map = [];
    for (let i = 0; i < this.grid.length; i++) {
      map[i] = Math.floor(Math.random() * 4);
    }
    this.loadMap(map);
  }

  loadMap(map) {
    if (map.length !== this.grid.length) {
      console.warn('Map size mismatch');
      return false;
    }
    this.createGridPieces(map);
    this.remapPieces();
  }

  createGridPieces(map) {
    const { grid, cellSize } = this;
    const pieces = [];
    for (let i = 0; i < grid.length; i++) {
      const slot = grid.slots[i];
      const type = map[i];
      pieces.push(new BoardPiece({ type, slot, size: cellSize }));
    }
    this.pieces = pieces;
  }

  remapPieces() {
    const { pieces } = this;
    const map = new WeakMap();
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      map.set(piece.slot, piece);
    }
    this.map = map;
  }

  getPieceAt(x, y) {
    const slot = this.grid.getSlotAt(x, y);
    if (!slot) console.warn('Invalid slot:', x, y);
    return this.map.get(slot);
  }

  snapToGrid(x, y) {
    const xOut = Math.floor(x / this.cellSize);
    const yOut = Math.floor(y / this.cellSize);
    return [xOut, yOut];
  }

  async mergePieces(fromPiece, toPiece) {
    fromPiece.slot = null;
    await fromPiece.moveTo(toPiece.slot, true);
    const idx = this.pieces.indexOf(fromPiece);
    this.pieces.splice(idx, 1);
  }

  async shiftPiece(piece, direction) {
    const newSlot = this.grid.getNeighbor(piece.slot, direction);
    piece.slot = newSlot;
    await piece.moveTo(newSlot, true);
  }

  applyGravity() {
    const { grid, pieces } = this;
    this.remapPieces();
    let applied = false;
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (!piece.slot) continue;
      const slot = grid.getNeighbor(piece.slot, DIRECTIONS.Right);
      if (slot && !this.getPieceAt(slot.x, slot.y)) {
        piece.slot = slot;
        piece.moveTo(slot, true);
        applied = true;
      }
    }
    if (applied) {
      this.applyGravity();
    }
  }

  async activatePieceAt(x, y) {
    const { grid } = this;
    this.remapPieces();
    const piece = this.getPieceAt(x, y);
    const moves = [];
    if (!piece) return;
    const crossNeighbors = grid.getCrossNeighbors(piece.slot);
    for (let dir in crossNeighbors) {
      const neighbors = crossNeighbors[dir];
      let attract = false;
      for (let i = 0; i < neighbors.length; i++) {
        const slot = neighbors[i];
        const current = this.getPieceAt(slot.x, slot.y);
        if (!current) break;
        const shiftDir = grid.invertDirection(DIRECTIONS[dir]);
        if (i === 0 && current.type === piece.type) {
          const move = this.mergePieces(current, piece, shiftDir);
          moves.push(move);
          attract = true;
        } else if (attract) {
          const move = this.shiftPiece(current, shiftDir);
          moves.push(move);
        }
      }
    }
    await Promise.all(moves);
    this.applyGravity();
  }

  get rows() {
    return this.grid.rows;
  }

  get cols() {
    return this.grid.cols;
  }

  get width() {
    return this.rows * this.cellSize;
  }

  get height() {
    return this.cols * this.cellSize;
  }
}