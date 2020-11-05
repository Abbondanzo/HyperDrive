import { Matrix4 } from "../math/Matrix4";
import fragmentShaderSource from "./basic_fragment.glsl";
import vertexShaderSource from "./basic_vertex.glsl";

export class BasicProgram {
  readonly program: WebGLProgram;
  private readonly gl: WebGLRenderingContext;

  // Vertex shader stuffs
  private readonly uniformProjectionMatrix: WebGLUniformLocation;
  private readonly uniformModelViewMatrix: WebGLUniformLocation;
  private readonly uniformNormalMatrix: WebGLUniformLocation;

  private readonly attributePosition: number;
  private readonly attributeNormals: number;

  constructor(gl: WebGLRenderingContext) {
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
    gl.useProgram(program);
    this.program = program;

    // Assign uniforms and attributes
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
    gl.enableVertexAttribArray(this.attributePosition);
    this.attributeNormals = gl.getAttribLocation(program, "a_normals");
    gl.enableVertexAttribArray(this.attributeNormals);
  }

  setProjectionMatrix(projectionMatrix: Matrix4) {
    this.gl.uniformMatrix4fv(
      this.uniformProjectionMatrix,
      false,
      projectionMatrix.getValues()
    );
  }

  setModelViewMatrix(modelViewMatrix: Matrix4) {
    this.gl.uniformMatrix4fv(
      this.uniformModelViewMatrix,
      false,
      modelViewMatrix.getValues()
    );
    const normalMatrix = modelViewMatrix.copy().inverse().transpose();
    this.gl.uniformMatrix4fv(
      this.uniformNormalMatrix,
      false,
      normalMatrix.getValues()
    );
  }
}
