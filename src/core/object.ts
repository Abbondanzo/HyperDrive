import { Vector3 } from "./math/Vector3";

export abstract class AbstractObject {
  isCamera: boolean;
  isLight: boolean;
  name: string;
  type: string;
  // Hierarchy relationship
  parent: AbstractObject | null;
  children: AbstractObject[];
  // Positioning
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;

  constructor() {
    this.isCamera = false;
    this.isLight = false;
    this.name = "";
    this.type = "object";

    this.parent = null;
    this.children = [];

    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3(1, 1, 1);
  }

  add(object: AbstractObject) {
    if (object.parent !== null) {
      object.parent.remove(object);
    }
    this.children.push(object);
  }

  remove(object: AbstractObject) {
    this.children = this.children.filter((obj) => obj === object);
  }
}
