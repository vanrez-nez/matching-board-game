import "./styles.css";

import Board from './Board';
import Canvas from "./Canvas";

const ROWS = 5;
const COLS = 5;
const SIZE = 50;

let hoverRow = 0;
let hoverCol = 0;

const board = new Board(ROWS, COLS, SIZE);
board.reset();

const canvas = new Canvas({
  width: SIZE * COLS,
  height: SIZE * ROWS,
  onFrameCallback: onFrame,
  onMouseMoveCallback: onMouseMove,
});
canvas.appendToBody();
canvas.startFrameLoop();

function drawBoard() {
  const { context } = canvas;
  const { pieces } = board;
  canvas.clear();
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const { row, col } = piece;
    piece.isHover = hoverRow === row && hoverCol === col;
    piece.update();
    piece.draw(context);
  }
}

function onMouseMove(x, y) {
  hoverCol = Math.floor(y / SIZE);
  hoverRow = Math.floor(x / SIZE);
}

let frames = 0;
function onFrame() {
  drawBoard();
  if (frames++ > 60*10) {
    //canvas.stopFrameLoop();
  }
}

