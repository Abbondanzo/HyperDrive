import { Renderer } from "../core/renderers";
import { Scene } from "../core/Scene";
import CameraManager from "./CameraManager";

class SceneManager {
  readonly canvas: HTMLCanvasElement;
  readonly scene: Scene;

  // Delta enforcement
  private renderInterval: number | null;
  static FRAME_RATE_PER_SECOND = 30;

  // Housekeeping
  private readonly renderer: Renderer;

  constructor() {
    this.canvas = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "canvas"
    ) as HTMLCanvasElement;
    this.scene = new Scene();
    this.renderInterval = null;
    this.renderer = new Renderer(this.canvas);
    // Scoping
    this.update = this.update.bind(this);
    // Bind this manager to the window
    const w = window as any;
    if (w.manager) {
      throw Error("Cannot have more than one scene manager!");
    }
    w.manager = this;
    // Add global camera
    this.scene.add(CameraManager.camera);
  }

  render() {
    const timeout = 1000 / SceneManager.FRAME_RATE_PER_SECOND;
    this.renderInterval = window.setInterval(this.update, timeout);
  }

  stop() {
    clearTimeout(this.renderInterval);
    this.renderInterval = null;
  }

  private update() {
    try {
      this.renderer.render(this.scene, CameraManager.camera);
    } catch (error) {
      console.warn(error);
      this.stop();
    }
  }
}

// Export single class instance
export default new SceneManager();
