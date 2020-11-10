import { Color } from "../../core/data/Color";
import { Mesh } from "../../core/objects/Mesh";
import m4 from "../common/util/m4";

const DIMENSIONS = 3;

export class Program {
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;

  private attributePosition: number;
  private positionBuffer: WebGLBuffer;

  private attributeNormals: number;
  private normalBuffer: WebGLBuffer;

  private readonly uniformColor: WebGLUniformLocation;
  private readonly uniformWorldViewProjection: WebGLUniformLocation;
  private readonly uniformWorldInverseTranspose: WebGLUniformLocation;
  private readonly uniformReverseLightDirectionLocation: WebGLUniformLocation;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
    this.gl = gl;
    this.program = program;

    this.uniformColor = this.gl.getUniformLocation(program, "u_color");
    this.uniformWorldViewProjection = this.gl.getUniformLocation(
      program,
      "u_worldViewProjection"
    );
    this.uniformWorldInverseTranspose = this.gl.getUniformLocation(
      program,
      "u_worldInverseTranspose"
    );
    this.uniformReverseLightDirectionLocation = this.gl.getUniformLocation(
      program,
      "u_reverseLightDirection"
    );
  }

  bind(mesh: Mesh) {
    // Actual func

    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) !== this.program) {
      this.gl.useProgram(this.program);
    }

    this.bufferData("a_coords", mesh.geometry.vertices);
    this.bufferData("a_normals", mesh.geometry.normals);
  }

  draw(mesh: Mesh) {
    // TODO: This length is set in constructor
    this.setColor(mesh.material.color);
    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0,
      mesh.geometry.vertices.length / DIMENSIONS
    );
  }

  applyProjection(viewProjectionMatrix: number[], modelViewMatrix: number[]) {
    const worldInverseTransposeMatrix = m4.transpose(m4.identity());
    this.gl.uniformMatrix4fv(
      this.uniformWorldViewProjection,
      false,
      viewProjectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.uniformWorldInverseTranspose,
      false,
      worldInverseTransposeMatrix
    );
    this.gl.uniformMatrix4fv(
      this.uniformWorldViewProjection,
      false,
      modelViewMatrix
    );
  }

  applyReverseLight(direction: number[]) {
    this.gl.uniform3fv(this.uniformReverseLightDirectionLocation, direction);
  }

  private bufferData(attribName: string, data: Float32Array) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
    const attributeLocation = this.gl.getAttribLocation(
      this.program,
      attribName
    );
    this.gl.enableVertexAttribArray(attributeLocation);
    this.gl.vertexAttribPointer(
      attributeLocation,
      DIMENSIONS, // dimensions
      this.gl.FLOAT, // type
      false, // normalized
      0, // stride
      0 // offset
    );
  }

  private setColor(color: Color) {
    this.gl.uniform4f(
      this.uniformColor,
      color.red / 255,
      color.green / 255,
      color.blue / 255,
      1
    );
  }
}
