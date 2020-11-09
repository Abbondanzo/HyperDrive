import { AbstractObject } from "../Object";
import { Geometry } from "./Geometry";
import { Material } from "./Material";

export class Mesh extends AbstractObject {
  static TYPE = "mesh";

  readonly geometry: Geometry;
  readonly material: Material;

  constructor() {
    super();
    this.name = "Mesh";
    this.type = Mesh.TYPE;
  }
}
