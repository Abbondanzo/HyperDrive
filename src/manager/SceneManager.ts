import { Scene, WebGLRenderer } from "three";

import {
  addFrameListener,
  FrameEvent,
  removeFrameListener,
} from "../events/frame";
import {
  addWindowResizeListener,
  dispatchWindowResizeEvent,
  WindowResizeEvent,
} from "../events/windowResize";
import CameraManager from "./CameraManager";
import EventManager from "./EventManager";

class SceneManager {
  readonly scene: Scene;
  private readonly renderer: WebGLRenderer;

  constructor() {
    this.scene = new Scene();
    this.scene.add(CameraManager.camera);
    this.renderer = new WebGLRenderer();
    addFrameListener(this.update);
    addWindowResizeListener(this.handleResize);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);
    EventManager.addListeners();
    // Dispatch a global event to check the height since we've now attached our canvas
    dispatchWindowResizeEvent({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  private readonly handleResize = ({ width, height }: WindowResizeEvent) => {
    this.renderer.setSize(width, height);
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
