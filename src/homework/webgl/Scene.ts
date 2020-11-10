import { renderShape } from "../common/render";
import { Cube } from "../common/render/cube";
import { createProgramFromScripts } from "../common/setup/createProgramFromScripts";
import { degreesToRadians } from "../common/util/degrees";
import m4 from "../common/util/m4";
import Camera from "./Camera";
import Light from "./Light";
import { Program } from "./Program";

const DIMENSIONS = 3;

export default class Scene {
  private readonly gl: WebGLRenderingContext;
  private readonly attributeCoords: number;
  private readonly attributeNormals: number;
  private readonly bufferCoords: WebGLBuffer;
  private readonly normalBuffer: WebGLBuffer;

  private readonly tempProgram: Program;

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
    this.tempProgram = new Program(this.gl, program);

    // // Set up coordinate attributes for sending to each vertex
    // this.attributeCoords = this.gl.getAttribLocation(program, "a_coords");
    // this.gl.enableVertexAttribArray(this.attributeCoords);
    // this.bufferCoords = this.gl.createBuffer();

    // // Set up normals for sending to each vertex
    // this.attributeNormals = this.gl.getAttribLocation(program, "a_normals");
    // this.gl.enableVertexAttribArray(this.attributeNormals);
    // this.normalBuffer = this.gl.createBuffer();

    // configure canvas resolution and clear the canvas
    this.clearCanvas();
  }

  private clearCanvas() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  render(shapes: Canvas3D.Shape[], camera: Camera, light: Light) {
    // this.renderSetup();
    this.gl.enable(this.gl.DEPTH_TEST);

    if (shapes.length === 0) {
      this.clearCanvas();
      return;
    }

    // Apply projection matrix based on camera
    const canvas = this.gl.canvas as HTMLCanvasElement;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const viewProjectionMatrix = camera.getViewProjectionMatrix(aspect);

    // Set lighting direction
    this.tempProgram.applyReverseLight(light.getNormalizedDirection());

    shapes.forEach((shape) => {
      // compute transformation matrix
      const modelViewMatrix = this.computeModelViewMatrix(
        shape,
        viewProjectionMatrix
      );

      const mesh = new Cube();
      mesh.material.color.red = shape.color.red * 255;
      mesh.material.color.green = shape.color.green * 255;
      mesh.material.color.blue = shape.color.blue * 255;
      this.tempProgram.bind(mesh);
      this.tempProgram.applyProjection(viewProjectionMatrix, modelViewMatrix);
      this.tempProgram.draw(mesh);
    });
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
