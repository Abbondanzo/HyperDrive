export default class SceneManager {
  canvas: HTMLCanvasElement;

  private renderInterval: number | null;
  static FRAME_RATE_PER_SECOND = 30;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.renderInterval = null;
    // Scoping
    this.update = this.update.bind(this);
  }

  render() {
    const timeout = 1000 / SceneManager.FRAME_RATE_PER_SECOND;
    this.renderInterval = window.setInterval(this.update, timeout);
  }

  private update() {}
}
