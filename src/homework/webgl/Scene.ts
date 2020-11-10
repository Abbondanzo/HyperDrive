import { renderShape } from "../common/render";
import { createProgramFromScripts } from "../common/setup/createProgramFromScripts";
import { degreesToRadians } from "../common/util/degrees";
import m4 from "../common/util/m4";
import Camera from "./Camera";
import Light from "./Light";

const DIMENSIONS = 3;

export default class Scene {
  private readonly gl: WebGLRenderingContext;
  private readonly attributeCoords: number;
  private readonly attributeNormals: number;
  private readonly bufferCoords: WebGLBuffer;
  private readonly normalBuffer: WebGLBuffer;
  private readonly uniformColor: WebGLUniformLocation;
  private readonly uniformWorldViewProjection: WebGLUniformLocation;
  private readonly uniformWorldInverseTranspose: WebGLUniformLocation;
  private readonly uniformReverseLightDirectionLocation: WebGLUniformLocation;

  private constructor(
    canvas: HTMLCanvasElement,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    this.gl = canvas.getContext("webgl");

    // create and use a GLSL program
    const program = createProgramFromScripts(
      this.gl,
      vertexShaderSource,
      fragmentShaderSource
    );
    this.gl.useProgram(program);

    // Set up coordinate attributes for sending to each vertex
    this.attributeCoords = this.gl.getAttribLocation(program, "a_coords");
    this.gl.enableVertexAttribArray(this.attributeCoords);
    this.bufferCoords = this.gl.createBuffer();

    // Set up normals for sending to each vertex
    this.attributeNormals = this.gl.getAttribLocation(program, "a_normals");
    this.gl.enableVertexAttribArray(this.attributeNormals);
    this.normalBuffer = this.gl.createBuffer();

    // Grab uniform memory references
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

    // configure canvas resolution and clear the canvas
    const uniformResolution = this.gl.getUniformLocation(
      program,
      "u_resolution"
    );
    this.gl.uniform2f(
      uniformResolution,
      this.gl.canvas.width,
      this.gl.canvas.height
    );
    this.clearCanvas();
  }

  private clearCanvas() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  render(shapes: Canvas3D.Shape[], camera: Camera, light: Light) {
    this.renderSetup();

    if (shapes.length === 0) {
      this.clearCanvas();
      return;
    }

    // Apply projection matrix based on camera
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const cameraViewProjectionMatrix = camera.getViewProjectionMatrix(aspect);
    const worldViewProjectionMatrix = this.computeWorldViewProjectionMatrix(
      cameraViewProjectionMatrix
    );

    // Set lighting direction
    this.gl.uniform3fv(
      this.uniformReverseLightDirectionLocation,
      light.getNormalizedDirection()
    );

    shapes.forEach((shape) => {
      this.gl.uniform4f(
        this.uniformColor,
        shape.color.red,
        shape.color.green,
        shape.color.blue,
        1
      );

      // compute transformation matrix
      const M = this.computeModelViewMatrix(shape, worldViewProjectionMatrix);
      this.gl.uniformMatrix4fv(this.uniformWorldViewProjection, false, M);

      renderShape({
        context: this.gl,
        shape,
        bufferCoords: this.bufferCoords,
        normalBuffer: this.normalBuffer,
      });
    });
  }

  private renderSetup() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferCoords);
    this.gl.vertexAttribPointer(
      this.attributeCoords,
      DIMENSIONS,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.vertexAttribPointer(
      this.attributeNormals,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  }

  private computeWorldViewProjectionMatrix(viewProjectionMatrix: number[]) {
    const worldMatrix = m4.identity();
    const worldViewProjectionMatrix = m4.multiply(
      viewProjectionMatrix,
      worldMatrix
    );
    const worldInverseMatrix = m4.inverse(worldMatrix);
    const worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

    this.gl.uniformMatrix4fv(
      this.uniformWorldViewProjection,
      false,
      worldViewProjectionMatrix
    );
    this.gl.uniformMatrix4fv(
      this.uniformWorldInverseTranspose,
      false,
      worldInverseTransposeMatrix
    );

    return worldViewProjectionMatrix;
  }

  private computeModelViewMatrix(
    shape: Canvas3D.Shape,
    viewProjectionMatrix: number[]
  ) {
    let M = m4.translate(
      viewProjectionMatrix,
      shape.translation.x,
      shape.translation.y,
      shape.translation.z
    );
    M = m4.xRotate(M, degreesToRadians(shape.rotation.x));
    M = m4.yRotate(M, degreesToRadians(shape.rotation.y));
    M = m4.zRotate(M, degreesToRadians(shape.rotation.z));
    M = m4.scale(M, shape.scale.x, shape.scale.y, shape.scale.z);
    return M;
  }

  /**
   * ========================================
   * Scenes are singletons
   * ========================================
   */
  private static instance?: Scene;
  static getInstance() {
    if (!Scene.instance) {
      throw new Error("Scene not initialized with call to `init`");
    }
    return Scene.instance;
  }
  static init(
    canvas: HTMLCanvasElement,
    vertexShaderSource: string,
    fragmentShaderSource: string
  ) {
    Scene.instance = new Scene(
      canvas,
      vertexShaderSource,
      fragmentShaderSource
    );
    return Scene.instance;
  }
}
