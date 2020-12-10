import { PerspectiveCamera, Quaternion } from "three";

import { addFrameListener } from "../events/frame";
import {
  addWindowResizeListener,
  WindowResizeEvent,
} from "../events/windowResize";
import { BetterPointerLockControls } from "../scene/controls/BetterPointerLockControls";

class CameraManager {
  private static CSS_DISTANCE = 500;
  private static DEFAULT_FOV = 60;
  private static NEAR = 0.1;
  private static FAR = 500;

  readonly camera: PerspectiveCamera;
  readonly cssCamera: PerspectiveCamera;

  private controls: BetterPointerLockControls;
  private controlsLocked: boolean;
  private readonly quaternion: Quaternion;

  constructor() {
    this.camera = new PerspectiveCamera(
      CameraManager.DEFAULT_FOV,
      1,
      CameraManager.NEAR,
      CameraManager.FAR
    );
    this.cssCamera = new PerspectiveCamera(
      CameraManager.DEFAULT_FOV,
      1,
      CameraManager.NEAR,
      CameraManager.FAR
    );
    this.cssCamera.position.z = CameraManager.CSS_DISTANCE;
    this.controlsLocked = false;
    this.quaternion = new Quaternion();
    addWindowResizeListener(this.updateSize);
    addFrameListener(this.updateCSSCamera);
  }

  private readonly updateSize = ({ width, height }: WindowResizeEvent) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.cssCamera.aspect = width / height;
    this.cssCamera.updateProjectionMatrix();
  };

  private readonly updateCSSCamera = () => {
    if (this.controlsLocked) {
      this.camera.getWorldQuaternion(this.quaternion);
      this.cssCamera.setRotationFromQuaternion(this.quaternion);
    }
  };

  initializeControls(element: HTMLElement) {
    this.controls = new BetterPointerLockControls(this.camera, element);
    element.addEventListener("click", () => {
      if (!this.controls.isLocked) {
        this.controls.lock();
      }
    });
    this.controls.addEventListener("lock", () => {
      this.controlsLocked = true;
      console.log("Controls Locked");
    });
    this.controls.addEventListener("unlock", () => {
      this.controlsLocked = false;
      console.log("Controls Unlocked");
    });
  }
}

export default new CameraManager();
