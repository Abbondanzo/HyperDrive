import fragmentShaderSource from "../shaders/basic_fragment.glsl";
import vertexShaderSource from "../shaders/basic_vertex.glsl";

export class BasicProgram {
  readonly program: WebGLProgram;

  // Vertex shader stuffs
  readonly uniformProjectionMatrix: WebGLUniformLocation;
  readonly uniformModelViewMatrix: WebGLUniformLocation;
  readonly uniformNormalMatrix: WebGLUniformLocation;

  readonly attributePosition: number;
  readonly attributeNormals: number;

  constructor(gl: WebGLRenderingContext) {
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
}
