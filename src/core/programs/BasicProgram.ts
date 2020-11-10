import { mat4 } from "gl-matrix";
import { Geometry } from "../objects/Geometry";
import { Material } from "../objects/Material";

import fragmentShaderSource from "../shaders/basic_fragment.glsl";
import vertexShaderSource from "../shaders/basic_vertex.glsl";

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

  private constructor(gl: WebGLRenderingContext, data: Float32Array) {
    this.gl = gl;

    const vertexShader = BasicProgram.createShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = BasicProgram.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

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

  static fromMesh(
    gl: WebGLRenderingContext,
    geometry: Geometry,
    material: Material
  ): BasicProgram {
    return new BasicProgram(gl, geometry.vertices);
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

  // HAHA companion object
  private static createShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
}
