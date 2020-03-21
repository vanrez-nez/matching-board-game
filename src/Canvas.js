import { debounce } from 'lodash';
const NOOP = () => {};

function toLocalCoords(domElement, mouseEvent) {
  const rect = domElement.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left;
  const y = mouseEvent.clientY - rect.top;
  return [x, y];
}

export default class Canvas {
  constructor({
    width,
    height,
    clearColor,
    onFrameCallback = NOOP,
    onMouseMoveCallback = NOOP,
    onMouseClickCallback = NOOP,
    onMouseScrollCallback = NOOP,
  }) {
    this.width = 0;
    this.height = 0;
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
    this.clearColor = clearColor || 'black';
    this.resize(width, height);
    this.onFrameCallback = onFrameCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.onMouseClickCallback = onMouseClickCallback;
    this.onMouseScrollCallback = debounce(onMouseScrollCallback, 100, { leading: true, trailing: false } );
    this.rafHandle = null;
    this.running = false;
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.domElement.addEventListener('wheel', this.onMouseScroll.bind(this));
  }

  appendToBody() {
    document.body.appendChild(this.domElement);
    this.clear();
    return this;
  }

  clear() {
    const { width, height, context, clearColor } = this;
    if (clearColor === 'transparent') {
      context.clearRect(0, 0, width, height);
    } else {
      context.fillStyle = clearColor;
      context.fillRect(0, 0, width, height);
    }
    return this;
  }

  setRotation(angle) {
    const { context, width, height } = this;
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    context.clearRect(-1, -1, width + 2, height + 2);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(halfW, halfH);
    context.rotate(angle * Math.PI / 180);
    context.translate(-halfW, -halfH);
  }

  onMouseScroll(e) {
    this.onMouseScrollCallback(e);
  }

  onMouseMove(e) {
    const [x, y] = toLocalCoords(this.domElement, e);
    this.onMouseMoveCallback(x, y);
  }

  onMouseClick(e) {
    const [x, y] = toLocalCoords(this.domElement, e);
    this.onMouseClickCallback(x, y);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.domElement.width = width;
    this.domElement.height = height;
    return this;
  }

  onFrame() {
    if (this.running) {
      this.onFrameCallback();
      this.rafHandle = window.requestAnimationFrame(this.onFrame.bind(this));
    }
  }

  startFrameLoop() {
    if (!this.running) {
      this.running = true;
      this.onFrame();
    }
    return this;
  }

  stopFrameLoop() {
    if (this.running) {
      this.running = false;
      window.cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    return this;
  }
}