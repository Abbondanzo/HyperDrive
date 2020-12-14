import { PerspectiveCamera, Quaternion, Raycaster } from "three";

import { addLockedMousemoveListener } from "../events/lockedMousemove";
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
  readonly raycaster: Raycaster;

  private controls: BetterPointerLockControls;
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
    this.quaternion = new Quaternion();
    this.raycaster = new Raycaster();
    addWindowResizeListener(this.updateSize);
    addLockedMousemoveListener(this.updateCSSCamera);
  }

  private readonly updateSize = ({ width, height }: WindowResizeEvent) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.cssCamera.aspect = width / height;
    this.cssCamera.updateProjectionMatrix();
  };

  private readonly updateCSSCamera = () => {
    this.camera.getWorldQuaternion(this.quaternion);
    this.cssCamera.setRotationFromQuaternion(this.quaternion);
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
  };

  initializeControls(element: HTMLElement) {
    this.controls = new BetterPointerLockControls(this.camera, element);
    element.addEventListener("click", () => {
      if (!this.controls.isLocked) {
        this.controls.lock();
      }
    });
    this.controls.addEventListener("lock", () => {
      console.log("Controls Locked");
    });
    this.controls.addEventListener("unlock", () => {
      console.log("Controls Unlocked");
      this.updateCSSCamera();
    });
  }
}

export default new CameraManager();
