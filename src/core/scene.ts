import AbstractObject from "./object";

export default class Scene extends AbstractObject {
  constructor() {
    super();
    this.name = "Scene";
    this.type = "scene";
  }
}
