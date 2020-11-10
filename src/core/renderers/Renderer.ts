import { Camera } from "../objects/Camera";
import { AbstractObject } from "../Object";
import { Scene } from "../Scene";
import { BasicProgram } from "../programs/BasicProgram";
import { Mesh } from "../objects/Mesh";
import { Light } from "../objects/Light";

interface RenderItems {
  objects: Mesh[];
  lights: Light[];
}

export class Renderer {
  private readonly gl: WebGLRenderingContext;
  private readonly programs: WeakMap<Mesh, BasicProgram>;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl");
    this.programs = new WeakMap();
  }

  render(scene: Scene, camera: Camera) {
    const { objects, lights } = this.toRenderItems(scene);

    camera.updateModelViewMatrix();
    camera.updateProjectionMatrix();

    objects.forEach((object) => {
      object.updateModelViewMatrix();

      const program = this.getProgram(object);
      program.bind();
      program.setModelViewMatrix(object.modelViewMatrix);
      program.setProjectionMatrix(camera.projectionMatrix);
      // TODO: Pass lights array to program
      program.draw();
    });
  }

  private toRenderItems(scene: Scene): RenderItems {
    const renderItems: RenderItems = { objects: [], lights: [] };
    this.toRenderItemsHelper(scene, renderItems);
    return renderItems;
  }

  private toRenderItemsHelper(
    object: AbstractObject,
    renderItems: RenderItems
  ) {
    switch (object.type) {
      case Light.TYPE:
        renderItems.lights.push(object as Light);
        break;
      case Mesh.TYPE:
        renderItems.objects.push(object as Mesh);
        break;
      case Scene.TYPE:
      case Camera.TYPE:
      default:
        break;
    }
    object.children.forEach((child) =>
      this.toRenderItemsHelper(child, renderItems)
    );
  }

  private getProgram(object: Mesh): BasicProgram {
    let program = this.programs.get(object);
    if (program) {
      return program;
    } else {
      program = BasicProgram.fromMesh(
        this.gl,
        object.geometry,
        object.material
      );
      this.programs.set(object, program);
      return program;
    }
  }
}
