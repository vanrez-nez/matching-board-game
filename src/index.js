import "./styles.css";
import 'babel-polyfill';
import Board from './Board';
import Canvas from "./Canvas";
import { gsap, Power4 } from "gsap";

const state = {
  xHover: 0,
  yHover: 0,
  rotating: false,
}

const board = new Board({
  rows: 10,
  cols: 10,
  cellSize: 40,
});
board.loadRandomMap();

const canvas = new Canvas({
  width: board.width,
  height: board.height,
  clearColor: '#1b0026',
  onFrameCallback: onFrame,
  onMouseMoveCallback: onMouseMove,
  onMouseClickCallback: onMouseClick,
  onMouseScrollCallback: onMouseScroll,
});
canvas.appendToBody().startFrameLoop();

function drawBoard() {
  const { context } = canvas;
  const { pieces } = board;
  const { xHover, yHover } = state;
  canvas.setRotation(board.rotation);
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

function onMouseMove(x, y) {
  const [xHover, yHover] = board.snapToGrid(x, y);
  state.xHover = xHover;
  state.yHover = yHover;
}

function onMouseScroll(e) {
  if (state.rotating) return;
  state.rotating = true;
  const clockwise = e.deltaY > 0;
  const step = clockwise ? 90 : -90;
  gsap.to(board, 0.4, {
    rotation: board.rotation + step,
    ease: Power4.easeInOut,
    onComplete() {
      board.applyGravity();
      state.rotating = false;
    }
  });
}

function onMouseClick(x, y) {
  const [xSnap, ySnap] = board.snapToGrid(x, y);
  board.activatePieceAt(xSnap, ySnap);
}

function onFrame() {
  drawBoard();
}
