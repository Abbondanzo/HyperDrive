import { Camera } from "../Camera";
import { AbstractObject } from "../Object";
import { Scene } from "../Scene";
import { BasicProgram } from "../shaders/BasicProgram";
import { Renderer } from "./Renderer";

interface RenderItems {
  objects: AbstractObject[];
  lights: AbstractObject[];
}

export class BufferRenderer implements Renderer {
  private readonly gl: WebGLRenderingContext;
  private readonly program: BasicProgram;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl");
    this.program = new BasicProgram(this.gl);
  }

  render(scene: Scene, camera: Camera) {
    const renderItems = this.toRenderItems(scene);
    camera;
  }

  private toRenderItems(scene: Scene): RenderItems {
    const renderItems: RenderItems = { objects: [], lights: [] };
    this.addToRenderItems(scene, renderItems);
    return renderItems;
  }

  private addToRenderItems(object: AbstractObject, renderItems: RenderItems) {
    if (object.isLight) {
      renderItems.lights.push(object);
    } else if (object.isCamera) {
      // pass
    } else {
      renderItems.objects.push(object);
    }
    object.children.forEach((child) =>
      this.addToRenderItems(child, renderItems)
    );
  }
}
