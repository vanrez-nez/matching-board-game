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
    onFrameCallback = NOOP,
    onMouseMoveCallback = NOOP,
    onMouseClickCallback = NOOP,
  }) {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
    this.clearColor = 'black';
    this.resize(width, height);
    this.onFrameCallback = onFrameCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.onMouseClickCallback = onMouseClickCallback;
    this.rafHandle = null;
    this.running = false;
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('click', this.onMouseClick.bind(this));
  }

  appendToBody() {
    document.body.appendChild(this.domElement);
    this.clear();
  }

  clear() {
    const { width, height, context, clearColor } = this;
    if (clearColor === 'transparent') {
      context.clearRect(0, 0, width, height);
    } else {
      context.fillStyle = clearColor;
      context.fillRect(0, 0, width, height);
    }
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
  }

  stopFrameLoop() {
    if (this.running) {
      this.running = false;
      window.cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
  }
}