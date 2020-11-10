import { vec3 } from "gl-matrix";

export class Geometry {
  readonly vertices: Float32Array;

  constructor(points: vec3[]) {
    this.vertices = new Float32Array([].concat(...points));
  }
}
