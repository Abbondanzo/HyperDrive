import { vec3 } from "gl-matrix";

export class Color {
  /**
   * 0 to 255
   */
  red: number;
  /**
   * 0 to 255
   */
  green: number;
  /**
   * 0 to 255
   */
  blue: number;

  constructor(red?: number, green?: number, blue?: number) {
    this.red = red || 0;
    this.green = green || 0;
    this.blue = blue || 0;
  }

  toVec3(): vec3 {
    return vec3.fromValues(this.red / 255, this.green / 255, this.blue / 255);
  }
}
