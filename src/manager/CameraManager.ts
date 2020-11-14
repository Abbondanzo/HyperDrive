import { PerspectiveCamera } from "three";

import { addMouseMoveListener, MouseMoveEvent } from "../events/mouseMove";
import {
  addWindowResizeListener,
  WindowResizeEvent,
} from "../events/windowResize";

class CameraManager {
  private static DEFAULT_FOV = 50;

  readonly camera: PerspectiveCamera;

  constructor() {
    this.camera = new PerspectiveCamera(CameraManager.DEFAULT_FOV);
    addWindowResizeListener(this.updateSize);
    addMouseMoveListener(this.updatePosition);
  }

  private readonly updateSize = ({ width, height }: WindowResizeEvent) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  private readonly updatePosition = ({ x, y }: MouseMoveEvent) => {
    console.log(x, y);
  };
}

export default new CameraManager();
