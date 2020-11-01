import { Vector3 } from "./Vector3";

export class Matrix4 {
  readonly values: number[];

  constructor(values?: number[]) {
    // prettier-ignore
    this.values = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
    if (values) {
      console.assert(values.length === 16, "Matrix value length unequal to 16");
      this.values = values;
    }
  }

  static identity(): Matrix4 {
    return new Matrix4();
  }

  static lookAt(root: Vector3, target: Vector3, up: Vector3): Matrix4 {
    const zAxis = root.copy().subtract(target).normalize();
    const xAxis = up.copy().cross(zAxis).normalize();
    const yAxis = zAxis.copy().cross(xAxis).normalize();
    // prettier-ignore
    return new Matrix4([
      xAxis.x, xAxis.y, xAxis.z, 0,
      yAxis.x, yAxis.y, yAxis.z, 0,
      zAxis.x, zAxis.y, zAxis.z, 0,
      root.x,  root.y,  root.z,  1
    ]);
  }
}
