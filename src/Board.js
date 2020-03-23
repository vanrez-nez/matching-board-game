import { gsap, Back, Bounce } from 'gsap';
import { DIRECTIONS } from './Grid';
import Grid from './Grid';
import { rotateAround, toRadians } from './Utils';
import BoardPiece from './BoardPiece';
import Analyser from './Analyser';

export default class Board {
  constructor({ rows, cols, cellSize, rotation = 0 }) {
    this.cellSize = cellSize;
    this.grid = new Grid({ rows, cols });
    this.pieces = [];
    this.map = null;
    this.rotation = rotation;
    this.analyser = new Analyser(this);
    this.remapPieces();
  }

  loadRandomMap() {
    const map = [];
    for (let i = 0; i < this.grid.length; i++) {
      map[i] = Math.floor(Math.random() * 6);
    }
    this.loadMap(map);
    this.analyser.update();
  }

  loadMap(map) {
    if (map.length !== this.grid.length) {
      console.error('Map size mismatch');
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
    if (!slot) console.error('Invalid slot:', x, y);
    return this.map.get(slot);
  }

  snapToGrid(x, y) {
    const { rotation, cellSize, width, height } = this;
    const theta = -toRadians(rotation);
    const centerX = width / 2;
    const centerY = height / 2;
    const [rotX, rotY] = rotateAround(centerX, centerY, x, y, theta);
    const xOut = Math.floor(rotX / cellSize);
    const yOut = Math.floor(rotY / cellSize);
    return [xOut, yOut];
  }

  async mergePieces(fromPiece, toPiece) {
    fromPiece.slot = null;
    await fromPiece.shiftTo(toPiece.slot);
    const idx = this.pieces.indexOf(fromPiece);
    this.pieces.splice(idx, 1);
  }

  async shiftPiece(piece, direction) {
    const newSlot = this.grid.getNeighbor(piece.slot, direction);
    piece.slot = newSlot;
    await piece.shiftTo(newSlot, true);
  }

  getGravityDirection() {
    const quadrant = Math.round(this.rotation / 90) % 4;
    const { Down, Right, Up, Left } = DIRECTIONS;
    return [Right, Up, Left, Down, Right, Up, Left][3 + quadrant];
  }

  fillEmptySlots() {
    const { grid, cellSize } = this;
    const dir = this.getGravityDirection();
    for (let i = 0; i < grid.length; i++) {
      const slot = grid.slots[i];
      if (!this.getPieceAt(slot.x, slot.y)) {
        const piece = new BoardPiece({
          type: Math.floor(Math.random() * 5),
          size: cellSize,
          slot,
        });
        const [offsetX, offsetY] = grid.invertDirection(dir);
        piece.position.x = piece.size * (piece.slot.x + offsetX);
        piece.position.y = piece.size * (piece.slot.y + offsetY);
        piece.fallTo(slot);
        this.pieces.push(piece);
      }
    }
    this.remapPieces();
  }

  applyGravity() {
    const { grid, pieces } = this;
    this.remapPieces();
    let applied = false;
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i];
      if (!piece.slot) continue;
      const direction = this.getGravityDirection();
      const slot = grid.getNeighbor(piece.slot, direction);
      if (slot && !this.getPieceAt(slot.x, slot.y)) {
        piece.slot = slot;
        piece.fallTo(slot);
        applied = true;
      }
    }
    if (applied) {
      this.applyGravity();
    }
  }

  async activatePieceAt(x, y) {
    const { grid, analyser } = this;
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
    analyser.update();
    if (analyser.movesLeft === 0) {
      console.log('fillEmptySlots')
      this.fillEmptySlots();
    }
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

  clone() {
    const { rows, cols, cellSize, pieces, rotation } = this;
    const clone = new Board({ rows, cols, cellSize, rotation });
    for (let i = 0; i < pieces.length; i++) {
      const piece = pieces[i].clone();
      // rematch old slot references to new grid
      piece.slot = clone.grid.getSlotAt(piece.slot.x, piece.slot.y);
      clone.pieces[i] = piece;
    }
    clone.remapPieces();
    return clone;
  }
}