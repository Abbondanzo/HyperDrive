import { PerspectiveCamera } from "three";

import {
  addWindowResizeListener,
  WindowResizeEvent,
} from "../events/windowResize";
import { BetterPointerLockControls } from "../scene/controls/BetterPointerLockControls";

class CameraManager {
  private static DEFAULT_FOV = 60;

  readonly camera: PerspectiveCamera;

  private controls: BetterPointerLockControls;

  constructor() {
    this.camera = new PerspectiveCamera(CameraManager.DEFAULT_FOV);
    addWindowResizeListener(this.updateSize);
  }

  private readonly updateSize = ({ width, height }: WindowResizeEvent) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  initializeControls(element: HTMLElement) {
    this.controls = new BetterPointerLockControls(this.camera, element);
    element.addEventListener("click", () => {
      if (!this.controls.isLocked) {
        this.controls.lock();
      }
    });
    this.controls.addEventListener("lock", function () {
      console.log("Controls Locked");
    });
    this.controls.addEventListener("unlock", function () {
      console.log("Controls Unlocked");
    });
  }
}

export default new CameraManager();
