import { degreesToRadians, radiansToDegrees } from "../common/util/degrees";
import m4 from "../common/util/m4";

const UP = [0, 1, 0];
const Z_NEAR = 1;
const Z_FAR = 2000;

export interface CameraSettings {
  fovDegrees: number;
  translation: Canvas3D.Translation;
  rotation?: Canvas3D.Translation;
  target?: Canvas3D.Position;
}

export default class Camera {
  rotation: Canvas3D.Rotation;
  translation: Canvas3D.Translation;
  private target?: Canvas3D.Position;
  private fovRadians: number;

  constructor() {
    this.rotation = { x: 0, y: 0, z: 0 };
    this.translation = { x: 0, y: 0, z: 0 };
    this.fovRadians = degreesToRadians(60);
  }

  setTarget(position: Canvas3D.Position) {
    this.target = position;
  }

  removeTarget() {
    this.target = undefined;
  }

  getFOVDegrees() {
    return radiansToDegrees(this.fovRadians);
  }

  setFOV(fovDegrees: number) {
    this.fovRadians = degreesToRadians(fovDegrees);
  }

  getViewProjectionMatrix(aspect: number) {
    const viewMatrix = this.getViewMatrix();
    const projectionMatrix = m4.perspective(
      this.fovRadians,
      aspect,
      Z_NEAR,
      Z_FAR
    );
    return m4.multiply(projectionMatrix, viewMatrix);
  }

  private getViewMatrix() {
    let cameraMatrix = m4.identity();
    if (this.target !== undefined) {
      cameraMatrix = this.applyTranslation(cameraMatrix);
      // Here, we invert the position since it gets inverted back below
      const cameraPosition = [
        -cameraMatrix[12],
        -cameraMatrix[13],
        -cameraMatrix[14],
      ];

      cameraMatrix = m4.lookAt(cameraPosition, this.getTargetAsMatrix(), UP);
      cameraMatrix = m4.inverse(cameraMatrix);
    } else {
      cameraMatrix = this.applyRotation(cameraMatrix);
      cameraMatrix = this.applyTranslation(cameraMatrix);
    }
    return cameraMatrix;
  }

  private getTargetAsMatrix() {
    return [this.target.x, this.target.y, this.target.z];
  }

  private applyRotation(matrix: number[]) {
    matrix = m4.zRotate(matrix, degreesToRadians(this.rotation.z));
    matrix = m4.xRotate(matrix, degreesToRadians(this.rotation.x));
    matrix = m4.yRotate(matrix, degreesToRadians(this.rotation.y));

    return matrix;
  }

  private applyTranslation(matrix: number[]) {
    return m4.translate(
      matrix,
      this.translation.x,
      this.translation.y,
      this.translation.z
    );
  }

  static fromSettings(cameraSettings: CameraSettings): Camera {
    const camera = new Camera();
    camera.setFOV(cameraSettings.fovDegrees);
    camera.translation = cameraSettings.translation;
    if (cameraSettings.rotation) {
      camera.rotation = cameraSettings.rotation;
    }
    if (cameraSettings.target) {
      camera.setTarget(cameraSettings.target);
    }
    return camera;
  }
}
