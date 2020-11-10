import { mat4, vec3 } from "gl-matrix";

const UP = vec3.fromValues(0, 1, 0);

export abstract class AbstractObject {
  isCamera: boolean;
  isLight: boolean;
  name: string;
  type: string;
  // Hierarchy relationship
  children: AbstractObject[];
  // Positioning
  modelViewMatrix: mat4;
  position: vec3;
  rotation: mat4;
  scale: vec3;

  constructor() {
    this.isCamera = false;
    this.isLight = false;
    this.name = "";
    this.type = "object";

    this.children = [];

    this.position = vec3.zero(vec3.create());
    this.rotation = mat4.create();
    this.scale = vec3.fromValues(1, 1, 1);
    this.updateModelViewMatrix();
  }

  add(object: AbstractObject) {
    this.children.push(object);
  }

  remove(object: AbstractObject) {
    this.children = this.children.filter((obj) => obj === object);
  }

  lookAt(target: vec3) {
    let rotationMatrix: mat4;
    if (this.isCamera || this.isLight) {
      rotationMatrix = mat4.lookAt(mat4.create(), this.position, target, UP);
    } else {
      rotationMatrix = mat4.lookAt(mat4.create(), target, this.position, UP);
    }
    this.rotation = rotationMatrix;
    this.updateModelViewMatrix();
  }

  rotate(axis: "x" | "y" | "z", angleRadians: number) {
    if (axis === "x") {
      this.rotation = mat4.rotateX(mat4.create(), this.rotation, angleRadians);
    } else if (axis === "y") {
      this.rotation = mat4.rotateY(mat4.create(), this.rotation, angleRadians);
    } else if (axis === "z") {
      this.rotation = mat4.rotateZ(mat4.create(), this.rotation, angleRadians);
    }
    this.updateModelViewMatrix();
  }

  updateModelViewMatrix() {
    let M = mat4.create();
    M = mat4.scale(mat4.create(), M, this.scale);
    M = mat4.multiply(mat4.create(), M, this.rotation);
    M = mat4.translate(mat4.create(), M, this.position);
    this.modelViewMatrix = M;
  }
}
