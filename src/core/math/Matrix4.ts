import { Vector3 } from "./Vector3";

export class Matrix4 {
  private values: number[];

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

  static scaling(x: number, y: number, z: number): Matrix4 {
    // prettier-ignore
    return new Matrix4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
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

  static xRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    // prettier-ignore
    return new Matrix4([
      1, 0,  0, 0,
      0, c,  s, 0,
      0, -s, c, 0,
      0, 0,  0, 1,
    ]);
  }

  static yRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    // prettier-ignore
    return new Matrix4([
      c, 0, -s, 0,
      0, 1, 0,  0,
      s, 0, c,  0,
      0, 0, 0,  1,
    ]);
  }

  static zRotation(angleInRadians: number): Matrix4 {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    // prettier-ignore
    return new Matrix4([
      c,  s, 0, 0,
      -s, c, 0, 0,
      0,  0, 1, 0,
      0,  0, 0, 1,
    ]);
  }

  /**
   * We don't really care about mutation, just reassignment.
   */
  getValues(): number[] {
    return this.values;
  }

  multiply(other: Matrix4): Matrix4 {
    const a = this.values;
    const b = other.values;
    const a00 = a[0 * 4 + 0];
    const a01 = a[0 * 4 + 1];
    const a02 = a[0 * 4 + 2];
    const a03 = a[0 * 4 + 3];
    const a10 = a[1 * 4 + 0];
    const a11 = a[1 * 4 + 1];
    const a12 = a[1 * 4 + 2];
    const a13 = a[1 * 4 + 3];
    const a20 = a[2 * 4 + 0];
    const a21 = a[2 * 4 + 1];
    const a22 = a[2 * 4 + 2];
    const a23 = a[2 * 4 + 3];
    const a30 = a[3 * 4 + 0];
    const a31 = a[3 * 4 + 1];
    const a32 = a[3 * 4 + 2];
    const a33 = a[3 * 4 + 3];
    const b00 = b[0 * 4 + 0];
    const b01 = b[0 * 4 + 1];
    const b02 = b[0 * 4 + 2];
    const b03 = b[0 * 4 + 3];
    const b10 = b[1 * 4 + 0];
    const b11 = b[1 * 4 + 1];
    const b12 = b[1 * 4 + 2];
    const b13 = b[1 * 4 + 3];
    const b20 = b[2 * 4 + 0];
    const b21 = b[2 * 4 + 1];
    const b22 = b[2 * 4 + 2];
    const b23 = b[2 * 4 + 3];
    const b30 = b[3 * 4 + 0];
    const b31 = b[3 * 4 + 1];
    const b32 = b[3 * 4 + 2];
    const b33 = b[3 * 4 + 3];
    // prettier-ignore
    this.values = [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
    return this;
  }

  rotate(axis: "x" | "y" | "z", angleInRadians: number): Matrix4 {
    let rotationMatrix: Matrix4;
    if (axis === "x") {
      rotationMatrix = Matrix4.xRotation(angleInRadians);
    } else if (axis === "y") {
      rotationMatrix = Matrix4.yRotation(angleInRadians);
    } else if (axis === "z") {
      rotationMatrix = Matrix4.zRotation(angleInRadians);
    }
    this.multiply(rotationMatrix);
    return this;
  }
}
