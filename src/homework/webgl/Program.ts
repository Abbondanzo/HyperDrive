import { Color } from "../../core/data/Color";
import { createProgramFromScripts } from "../common/setup/createProgramFromScripts";
import m4 from "../common/util/m4";
import fragmentShaderSource from "../shaders/basic_fragment.glsl";
import vertexShaderSource from "../shaders/basic_vertex.glsl";

const DIMENSIONS = 3;

interface ObjectProperties {
  vertices: Float32Array;
  normals: Float32Array;
}

interface ProgramUniforms {
  color: Color;
  modelViewMatrix: number[];
  reverseLightDirection: number[];
  viewProjectionMatrix: number[];
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
  private readonly uniformViewProjection: WebGLUniformLocation;
  private readonly uniformModelView: WebGLUniformLocation;
  private readonly uniformWorldInverseTranspose: WebGLUniformLocation;
  private readonly uniformReverseLightDirectionLocation: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    { vertices, normals }: ObjectProperties
  ) {
    this.gl = gl;
    this.program = Program.getProgram(gl);

    // Buffers
    this.positionBuffer = this.gl.createBuffer();
    this.setPositionData(vertices);
    this.vertexCount = vertices.length / DIMENSIONS;
    this.normalBuffer = this.gl.createBuffer();
    this.setNormalData(normals);

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
    this.uniformViewProjection = this.gl.getUniformLocation(
      this.program,
      "u_projectionMatrix"
    );
    this.uniformModelView = this.gl.getUniformLocation(
      this.program,
      "u_modelViewMatrix"
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

  bind(uniforms: ProgramUniforms) {
    if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) !== this.program) {
      this.gl.useProgram(this.program);
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.enableAttribute(this.attributePosition);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.enableAttribute(this.attributeNormals);

    this.applyUniforms(uniforms);
  }

  private enableAttribute(attributeLocation: number) {
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

  private applyUniforms({
    color,
    modelViewMatrix,
    reverseLightDirection,
    viewProjectionMatrix,
  }: ProgramUniforms) {
    this.applyColor(color);
    this.applyViewProjection(viewProjectionMatrix);
    this.applyModelView(modelViewMatrix);
    this.applyInverseTranspose();
    this.applyReverseLight(reverseLightDirection);
  }

  private applyColor(color: Color) {
    this.gl.uniform4f(
      this.uniformColor,
      color.red / 255,
      color.green / 255,
      color.blue / 255,
      1
    );
  }

  private applyViewProjection(viewProjectionMatrix: number[]) {
    this.gl.uniformMatrix4fv(
      this.uniformViewProjection,
      false,
      viewProjectionMatrix
    );
  }

  private applyModelView(modelViewMatrix: number[]) {
    this.gl.uniformMatrix4fv(this.uniformModelView, false, modelViewMatrix);
  }

  private applyInverseTranspose() {
    const worldInverseTransposeMatrix = m4.transpose(m4.identity());
    this.gl.uniformMatrix4fv(
      this.uniformWorldInverseTranspose,
      false,
      worldInverseTransposeMatrix
    );
  }

  private applyReverseLight(direction: number[]) {
    this.gl.uniform3fv(this.uniformReverseLightDirectionLocation, direction);
  }

  draw() {
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
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
