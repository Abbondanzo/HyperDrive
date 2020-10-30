import Vector from "./primitives/vector";

export default abstract class AbstractObject {
  isCamera: boolean;
  isLight: boolean;
  name: string;
  type: string;
  // Hierarchy relationship
  parent: AbstractObject | null;
  children: AbstractObject[];
  // Positioning
  position: Vector;
  rotation: Vector;
  scale: Vector;

  constructor() {
    this.isCamera = false;
    this.isLight = false;
    this.name = "";
    this.type = "object";

    this.parent = null;
    this.children = [];

    this.position = new Vector();
    this.rotation = new Vector();
    this.scale = new Vector(1, 1, 1);
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
