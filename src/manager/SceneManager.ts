import { Scene, WebGLRenderer } from "three";

import { dispatchCanvasResizeEvent } from "../events/canvasResize";
import {
  addFrameListener,
  FrameEvent,
  removeFrameListener,
} from "../events/frame";
import CameraManager from "./CameraManager";

class SceneManager {
  readonly scene: Scene;
  private readonly renderer: WebGLRenderer;

  constructor() {
    this.scene = new Scene();
    this.scene.add(CameraManager.camera);
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    addFrameListener(this.update);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  private readonly handleResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    dispatchCanvasResizeEvent({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  private update = ({}: FrameEvent) => {
    try {
      this.renderer.render(this.scene, CameraManager.camera);
    } catch (error) {
      console.warn(error);
      removeFrameListener(this.update);
    }
  };
}

// Export single class instance
export default new SceneManager();
