import { AbstractObject } from "../Object";
import { Geometry } from "./Geometry";
import { Material } from "./Material";

export abstract class Mesh extends AbstractObject {
  static TYPE = "mesh";

  readonly geometry: Geometry;
  readonly material: Material;

  constructor(geometry: Geometry, material: Material) {
    super();
    this.name = "Mesh";
    this.type = Mesh.TYPE;
    this.geometry = geometry;
    this.material = material;
  }
}
