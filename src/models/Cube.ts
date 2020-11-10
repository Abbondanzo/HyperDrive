import { vec3 } from "gl-matrix";

import { Color } from "../core/data/Color";
import { Geometry } from "../core/objects/Geometry";
import { Material } from "../core/objects/Material";
import { Mesh } from "../core/objects/Mesh";

export class Cube extends Mesh {
  constructor() {
    super(
      new Geometry(Cube.getPoints()),
      new Material({ color: new Color(0, 0, 255) })
    );
  }

  private static getPoints(): vec3[] {
    // Front face
    const A = vec3.fromValues(-1, 1, 1); // TL
    const B = vec3.fromValues(1, 1, 1); // TR
    const C = vec3.fromValues(1, -1, 1); // BR
    const D = vec3.fromValues(-1, -1, 1); // BL

    // Back face (looking thru front)
    const E = vec3.fromValues(-1, 1, -1); // TL
    const F = vec3.fromValues(1, 1, -1); // TR
    const G = vec3.fromValues(1, -1, -1); // BR
    const H = vec3.fromValues(-1, -1, -1); // BL

    const posz = [A, B, C, A, C, D]; // front
    const posx = [B, F, G, B, G, C]; // right
    const negz = [F, E, H, F, H, G]; // back
    const negx = [E, A, D, E, D, H]; // left
    const posy = [A, E, F, A, F, B]; // top
    const negy = [D, C, G, D, G, H]; // bottom

    return [].concat(posz, posx, negz, negx, posy, negy);
  }
}
