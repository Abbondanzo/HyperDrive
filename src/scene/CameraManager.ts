import { Camera } from "../core/objects/Camera";

/**
 * Houses all logic regarding the main camera.
 *
 * Event subscriptions for mouse movement will happen here.
 */
class CameraManager {
  readonly camera: Camera;

  constructor() {
    this.camera = new Camera();
  }
}

export default new CameraManager();
