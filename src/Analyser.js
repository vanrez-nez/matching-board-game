import { DIRECTIONS } from './Grid';

function getAllNeighbors(board, piece) {
  const neighbors = [];
  for (let dir in DIRECTIONS) {
    const slot = board.grid.getNeighbor(piece.slot, DIRECTIONS[dir]);
    if (slot) {
      const neighbor = board.getPieceAt(slot.x, slot.y);
      if (neighbor) neighbors.push(neighbor);
    }
  }
  return neighbors;
}

function getMovesCount(board) {
  const { pieces  } = board;
  let availableMoves = 0;
  const accountedPieces = {};
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const neighbors = getAllNeighbors(board, piece);
    for (let j = 0; j < neighbors.length; j++) {
      const neighbor = neighbors[j];
      // avoid counting reciprocal movements
      const accounted = accountedPieces[neighbor.id];
      if (!accounted && neighbor.type === piece.type) {
        availableMoves++;
      }
    }
    accountedPieces[piece.id] = true;
  }
  return availableMoves;
}

export default class Analyser {
  constructor(board) {
    this.board = board;
  }

  analyse() {
    console.time('analyse');
    const { board } = this;
    const copyBoard = board.clone();
    let totalMoves = 0;
    for (let i = 0; i < 16; i++) {
      totalMoves = Math.max(getMovesCount(copyBoard), totalMoves);
      copyBoard.rotation += 90;
      copyBoard.applyGravity();
    }
    console.timeEnd('analyse');
    console.log(totalMoves);
  }

  hasMovesLeft() {

  }

}