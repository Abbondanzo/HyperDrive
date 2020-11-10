import { mat4 } from 'gl-matrix';

import { AbstractObject } from '../Object';

interface CameraOptions {
  fovRadians: number;
  aspect: number;
  near?: number;
  far?: number;
}

export class Camera extends AbstractObject {
  static TYPE = "camera";

  fovRadians: number;
  near: number;
  far: number;
  aspect: number;

  projectionMatrix: mat4;

  constructor({ fovRadians, aspect, near, far }: CameraOptions) {
    super();
    this.isCamera = true;
    this.name = "Camera";
    this.type = Camera.TYPE;

    this.fovRadians = fovRadians;
    this.aspect = aspect;
    this.near = near || 0.1;
    this.far = far || 2000;

    this.projectionMatrix = mat4.create();
    this.updateProjectionMatrix();
  }

  setFOV(fovDegrees: number) {
    const radians = ((fovDegrees % 360) * Math.PI) / 180;
    this.fovRadians = radians;
  }

  updateProjectionMatrix() {
    this.projectionMatrix = mat4.perspective(
      mat4.create(),
      this.fovRadians,
      this.aspect,
      this.near,
      this.far
    );
  }
}
