import "./styles.css";
import 'babel-polyfill';
import Board from './Board';
import Canvas from "./Canvas";

const WIDTH = 5;
const HEIGHT = 5;
const SIZE = 50;

let xHover = 0;
let yHover = 0;
const board = new Board(WIDTH, HEIGHT, SIZE);
board.reset();

const canvas = new Canvas({
  width: SIZE * HEIGHT,
  height: SIZE * WIDTH,
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
    if (piece) {
      const { cellX, cellY } = piece;
      piece.isHover = xHover === cellX && yHover === cellY;
      piece.draw(context);
    }
  }
}

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
