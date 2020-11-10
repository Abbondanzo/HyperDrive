import { vec3 } from "gl-matrix";
import { Mesh } from "../../../core/objects/Mesh";
import { Geometry } from "../../../core/objects/Geometry";
import { Material } from "../../../core/objects/Material";
import { Color } from "../../../core/data/Color";

// export const renderCube = (
//   gl: WebGLRenderingContext,
//   cube: Canvas3D.Cube,
//   bufferCoords: WebGLBuffer,
//   normalBuffer: WebGLBuffer | null
// ): Mesh => {
//   // Front face
//   const A = [-1, 1, 1]; // TL
//   const B = [1, 1, 1]; // TR
//   const C = [1, -1, 1]; // BR
//   const D = [-1, -1, 1]; // BL

//   // Back face (looking thru front)
//   const E = [-1, 1, -1]; // TL
//   const F = [1, 1, -1]; // TR
//   const G = [1, -1, -1]; // BR
//   const H = [-1, -1, -1]; // BL

//   const posz = [].concat(A, B, C, A, C, D); // front
//   const posx = [].concat(B, F, G, B, G, C); // right
//   const negz = [].concat(F, E, H, F, H, G); // back
//   const negx = [].concat(E, A, D, E, D, H); // left
//   const posy = [].concat(A, E, F, A, F, B); // top
//   const negy = [].concat(D, C, G, D, G, H); // bottom

//   const points = [].concat(posz, posx, negz, negx, posy, negy);

//   // gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
//   // gl.bufferData(
//   //   gl.ARRAY_BUFFER,
//   //   new Float32Array([].concat(...points)),
//   //   gl.STATIC_DRAW
//   // );

//   // if (normalBuffer) {
//   //   const front = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
//   //   const right = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
//   //   const back = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
//   //   const left = [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];
//   //   const top = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
//   //   const bottom = [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
//   //   const normals = [].concat(front, right, back, left, top, bottom);
//   //   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
//   //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
//   // }

//   // gl.drawArrays(gl.TRIANGLES, 0, 36);
//   const geometry = new Geometry(points);
//   return new Mesh(points);
// };

export class Cube extends Mesh {
  private static getGeometry() {
    // Front face
    const A = [-1, 1, 1]; // TL
    const B = [1, 1, 1]; // TR
    const C = [1, -1, 1]; // BR
    const D = [-1, -1, 1]; // BL

    // Back face (looking thru front)
    const E = [-1, 1, -1]; // TL
    const F = [1, 1, -1]; // TR
    const G = [1, -1, -1]; // BR
    const H = [-1, -1, -1]; // BL

    const posz = [].concat(A, B, C, A, C, D); // front
    const posx = [].concat(B, F, G, B, G, C); // right
    const negz = [].concat(F, E, H, F, H, G); // back
    const negx = [].concat(E, A, D, E, D, H); // left
    const posy = [].concat(A, E, F, A, F, B); // top
    const negy = [].concat(D, C, G, D, G, H); // bottom

    const points = [].concat(posz, posx, negz, negx, posy, negy);

    // gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
    // gl.bufferData(
    //   gl.ARRAY_BUFFER,
    //   new Float32Array([].concat(...points)),
    //   gl.STATIC_DRAW
    // );

    // if (normalBuffer) {
    const front = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const right = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
    const back = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
    const left = [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];
    const top = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    const bottom = [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
    const normals = [].concat(front, right, back, left, top, bottom);

    //   gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    // }

    // gl.drawArrays(gl.TRIANGLES, 0, 36);
    return new Geometry(points, normals);
  }

  constructor() {
    super(Cube.getGeometry(), new Material({ color: new Color(255, 0, 0) }));
  }
}
