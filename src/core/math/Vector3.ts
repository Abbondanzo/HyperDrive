export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x?: number, y?: number, z?: number) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  copy(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  normalize(): Vector3 {
    const length = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z
    );
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      this.x /= length;
      this.y /= length;
      this.z /= length;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
    return this;
  }

  subtract(other: Vector3): Vector3 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  cross(other: Vector3): Vector3 {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
}
