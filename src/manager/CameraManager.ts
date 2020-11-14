import { PerspectiveCamera } from "three";

import {
  addCanvasResizeListener,
  CanvasResizeEvent,
} from "../events/canvasResize";

/**
 * Houses all logic regarding the main camera.
 *
 * Event subscriptions for mouse movement and canvas resizing will happen here.
 */
class CameraManager {
  private static DEFAULT_FOV = 50;

  readonly camera: PerspectiveCamera;

  constructor() {
    this.camera = new PerspectiveCamera(CameraManager.DEFAULT_FOV);
    addCanvasResizeListener(this.updateSize);
  }

  private readonly updateSize = ({ width, height }: CanvasResizeEvent) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };
}

export default new CameraManager();
