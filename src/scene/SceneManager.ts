export default class SceneManager {
  canvas: HTMLCanvasElement;

  private renderInterval: number | null;
  static FRAME_RATE_PER_SECOND = 30;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderInterval = null;
    // Scoping
    this.update = this.update.bind(this);
    // Bind this manager to the window
    const w = window as any;
    if (w.manager) {
      throw Error("Cannot have more than one scene manager!");
    }
    w.manager = this;
  }

  render() {
    const timeout = 1000 / SceneManager.FRAME_RATE_PER_SECOND;
    this.renderInterval = window.setInterval(this.update, timeout);
  }

  stop() {
    clearTimeout(this.renderInterval);
    this.renderInterval = null;
  }

  private update() {}
}
