const NOOP = () => {};

export default class Canvas {
  constructor({
    width,
    height,
    onFrameCallback = NOOP,
    onMouseMoveCallback = NOOP,
  }) {
    this.domElement = document.createElement('canvas');
    this.context = this.domElement.getContext('2d');
    this.clearColor = 'black';
    this.resize(width, height);
    this.onFrameCallback = onFrameCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.rafHandle = null;
    this.running = false;
    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
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
    const rect = this.domElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.onMouseMoveCallback(x, y);
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