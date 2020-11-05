import { Vector3 } from "./math/Vector3";
import { Matrix4 } from "./math/Matrix4";

const UP = new Vector3(0, 1, 0);

export abstract class AbstractObject {
  isCamera: boolean;
  isLight: boolean;
  name: string;
  type: string;
  // Hierarchy relationship
  children: AbstractObject[];
  // Positioning
  position: Vector3;
  rotation: Matrix4;
  scale: Vector3;

  constructor() {
    this.isCamera = false;
    this.isLight = false;
    this.name = "";
    this.type = "object";

    this.children = [];

    this.position = new Vector3();
    this.rotation = Matrix4.scaling(0, 0, 0);
    this.scale = new Vector3(1, 1, 1);
  }

  add(object: AbstractObject) {
    this.children.push(object);
  }

  remove(object: AbstractObject) {
    this.children = this.children.filter((obj) => obj === object);
  }

  lookAt(target: Vector3) {
    let rotationMatrix: Matrix4;
    if (this.isCamera || this.isLight) {
      rotationMatrix = Matrix4.lookAt(this.position, target, UP);
    } else {
      rotationMatrix = Matrix4.lookAt(target, this.position, UP);
    }
    this.rotation = rotationMatrix;
  }

  rotate(axis: "x" | "y" | "z", angleRadians: number) {
    this.rotation.rotate(axis, angleRadians);
  }
}
