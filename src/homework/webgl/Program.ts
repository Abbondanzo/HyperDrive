import { Color } from "../../core/data/Color";
import { Mesh } from "../../core/objects/Mesh";
import { createProgramFromScripts } from "../common/setup/createProgramFromScripts";
import m4 from "../common/util/m4";
import fragmentShaderSource from "../shaders/basic_fragment.glsl";
import vertexShaderSource from "../shaders/basic_vertex.glsl";

const DIMENSIONS = 3;

interface ObjectProperties {
  vertices: Float32Array;
  normals: Float32Array;
  color: Color;
}

export class Program {
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;

  private readonly vertexCount: number;

  private readonly positionBuffer: WebGLBuffer;
  private readonly normalBuffer: WebGLBuffer;

  private readonly attributePosition: number;
  private readonly attributeNormals: number;

  private readonly uniformColor: WebGLUniformLocation;
  private readonly uniformWorldViewProjection: WebGLUniformLocation;
  private readonly uniformWorldInverseTranspose: WebGLUniformLocation;
  private readonly uniformReverseLightDirectionLocation: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    { vertices, normals, color }: ObjectProperties
  ) {
    this.gl = gl;
    this.program = Program.getProgram(gl);

    // Buffers
    this.positionBuffer = this.gl.createBuffer();
    this.setPositionData(vertices);
    this.vertexCount = vertices.length / DIMENSIONS;
    this.normalBuffer = this.gl.createBuffer();
    this.setNormalData(normals);

    this.setColor(color);

    // Attributes
    this.attributePosition = this.gl.getAttribLocation(
      this.program,
      "a_coords"
    );
    this.attributeNormals = this.gl.getAttribLocation(
      this.program,
      "a_normals"
    );

    // Uniforms
    this.uniformColor = this.gl.getUniformLocation(this.program, "u_color");
    this.uniformWorldViewProjection = this.gl.getUniformLocation(
      this.program,
      "u_worldViewProjection"
    );
    this.uniformWorldInverseTranspose = this.gl.getUniformLocation(
      this.program,
      "u_worldInverseTranspose"
    );
    this.uniformReverseLightDirectionLocation = this.gl.getUniformLocation(
      this.program,
      "u_reverseLightDirection"
    );
  }

  private setPositionData(vertices: Float32Array) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
  }

  private setNormalData(normals: Float32Array) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, normals, this.gl.STATIC_DRAW);
  }

  bind() {
    this.gl.useProgram(this.program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    console.log(
      this.gl.getBufferParameter(this.gl.ARRAY_BUFFER, this.gl.BUFFER_SIZE)
    );
    this.enableAttribute(this.attributePosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.enableAttribute(this.attributeNormals);
  }

  private enableAttribute(attributeLocation: number) {
    this.gl.vertexAttribPointer(
      attributeLocation,
      DIMENSIONS, // dimensions
      this.gl.FLOAT, // type
      false, // normalized
      0, // stride
      0 // offset
    );
    this.gl.enableVertexAttribArray(attributeLocation);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
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

  private setColor(color: Color) {
    this.gl.uniform4f(
      this.uniformColor,
      color.red / 255,
      color.green / 255,
      color.blue / 255,
      1
    );
  }

  private static getProgram(gl: WebGLRenderingContext): WebGLProgram {
    const program = createProgramFromScripts(
      gl,
      vertexShaderSource,
      fragmentShaderSource
    );
    gl.useProgram(program);
    return program;
  }
}
