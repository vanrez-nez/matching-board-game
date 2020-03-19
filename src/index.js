import "./styles.css";
import 'babel-polyfill';
import Board from './Board';
import Canvas from "./Canvas";

let xHover = 0;
let yHover = 0;

const board = new Board({
  rows: 10,
  cols: 10,
  cellSize: 40,
});
board.loadRandomMap();

const canvas = new Canvas({
  width: board.width,
  height: board.height,
  onFrameCallback: onFrame,
  onMouseMoveCallback: onMouseMove,
  onMouseClickCallback: onMouseClick,
});
canvas.appendToBody().startFrameLoop();

function drawBoard() {
  const { context } = canvas;
  const { pieces } = board;
  canvas.clear();
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (piece.slot) {
      const { x, y } = piece.slot;
      piece.isHover = xHover === x && yHover === y;
    }
    piece.draw(context);
  }
}

console.log(board, canvas)

function onMouseMove(x, y) {
  [xHover, yHover] = board.snapToGrid(x, y);
}

function onMouseClick(x, y) {
  const [xSnap, ySnap] = board.snapToGrid(x, y);
  board.activatePieceAt(xSnap, ySnap);
}

function onFrame() {
  drawBoard();
}
