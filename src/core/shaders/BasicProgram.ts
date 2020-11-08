import { mat4 } from "gl-matrix";

import fragmentShaderSource from "./basic_fragment.glsl";
import vertexShaderSource from "./basic_vertex.glsl";

const DIMENSIONS = 3;

/**
 * This entire class's purpose is for exploring how to set up a scene and
 * manage data buffers. Do not use in normal code.
 */
export class BasicProgram {
  readonly program: WebGLProgram;
  private readonly gl: WebGLRenderingContext;

  private readonly positionCount: number;
  private readonly positionBuffer: WebGLBuffer;

  // Vertex shader stuffs
  private readonly uniformProjectionMatrix: WebGLUniformLocation;
  private readonly uniformModelViewMatrix: WebGLUniformLocation;
  private readonly uniformNormalMatrix: WebGLUniformLocation;

  private readonly attributePosition: number;
  private readonly attributeNormals: number;

  constructor(gl: WebGLRenderingContext, data: Float32Array) {
    this.gl = gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Link the two shaders into a program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    this.program = program;

    // Assign uniform and attribute locations
    this.uniformProjectionMatrix = gl.getUniformLocation(
      program,
      "u_projectionMatrix"
    );
    this.uniformModelViewMatrix = gl.getUniformLocation(
      program,
      "u_modelViewMatrix"
    );
    this.uniformNormalMatrix = gl.getUniformLocation(program, "u_normalMatrix");
    this.attributePosition = gl.getAttribLocation(program, "a_position");
    this.attributeNormals = gl.getAttribLocation(program, "a_normals");

    // Create data buffers
    this.positionCount = data.length / DIMENSIONS;
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  bind() {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) !== this.program) {
      this.gl.useProgram(this.program);
    }

    this.enableVertexAttribute(this.attributePosition);
    this.enableVertexAttribute(this.attributeNormals);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.positionCount);
  }

  private enableVertexAttribute(attributeIndex: number) {
    this.gl.enableVertexAttribArray(attributeIndex);
    this.gl.vertexAttribPointer(
      attributeIndex,
      DIMENSIONS, // dimensions
      this.gl.FLOAT, // type
      false, // normalized
      0, // stride
      0 // offset
    );
  }

  setProjectionMatrix(projectionMatrix: mat4) {
    this.gl.uniformMatrix4fv(
      this.uniformProjectionMatrix,
      false,
      projectionMatrix
    );
  }

  setModelViewMatrix(modelViewMatrix: mat4) {
    this.gl.uniformMatrix4fv(
      this.uniformModelViewMatrix,
      false,
      modelViewMatrix
    );
    const normalMatrix = this.toNormalMatrix(modelViewMatrix);
    this.gl.uniformMatrix4fv(this.uniformNormalMatrix, false, normalMatrix);
  }

  private toNormalMatrix(matrix: mat4) {
    let M = mat4.invert(mat4.create(), matrix);
    return mat4.transpose(mat4.create(), M);
  }
}
