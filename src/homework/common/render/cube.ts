export const renderCube = (
  gl: WebGLRenderingContext,
  cube: Canvas3D.Cube,
  bufferCoords: WebGLBuffer,
  normalBuffer: WebGLBuffer | null
) => {
  const x1 = cube.position.x - cube.dimensions.width / 2;
  const y1 = cube.position.y - cube.dimensions.height / 2;
  const z1 = cube.position.z + cube.dimensions.depth / 2;
  const x2 = cube.position.x + cube.dimensions.width / 2;
  const y2 = cube.position.y + cube.dimensions.height / 2;
  const z2 = cube.position.z - cube.dimensions.depth / 2;

  // Front face
  const A = [x1, y2, z1]; // TL
  const B = [x2, y2, z1]; // TR
  const C = [x2, y1, z1]; // BR
  const D = [x1, y1, z1]; // BL

  // Back face (looking thru front)
  const E = [x1, y2, z2]; // TL
  const F = [x2, y2, z2]; // TR
  const G = [x2, y1, z2]; // BR
  const H = [x1, y1, z2]; // BL

  const posz = [].concat(A, B, C, A, C, D); // front
  const posx = [].concat(B, F, G, B, G, C); // right
  const negz = [].concat(F, E, H, F, H, G); // back
  const negx = [].concat(E, A, D, E, D, H); // left
  const posy = [].concat(A, E, F, A, F, B); // top
  const negy = [].concat(D, C, G, D, G, H); // bottom

  const points = [].concat(posz, posx, negz, negx, posy, negy);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCoords);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

  if (normalBuffer) {
    const front = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    const right = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
    const back = [0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1];
    const left = [-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0];
    const top = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];
    const bottom = [0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0];
    const normals = [].concat(front, right, back, left, top, bottom);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  }

  gl.drawArrays(gl.TRIANGLES, 0, 36);
};
