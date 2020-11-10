export class Geometry {
  readonly vertices: Float32Array;
  readonly normals: Float32Array;

  constructor(points: number[], normals?: number[]) {
    this.vertices = new Float32Array(points);
    this.normals = new Float32Array(normals || []);
  }
}
