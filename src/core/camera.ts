import AbstractObject from "./object";

export default class Camera extends AbstractObject {
  constructor() {
    super();
    this.isCamera = true;
    this.name = "Camera";
    this.type = "camera";
  }
}
