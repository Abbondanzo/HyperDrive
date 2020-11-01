import { Camera } from "../Camera";
import { AbstractObject } from "../Object";
import { Scene } from "../Scene";
import { Renderer } from "./Renderer";

interface RenderItems {
  objects: AbstractObject[];
  lights: AbstractObject[];
}

export class BufferRenderer implements Renderer {
  private readonly gl: WebGLRenderingContext;
  private readonly attributeCoords: number;
  private readonly attributeNormals: number;
  private readonly bufferCoords: WebGLBuffer;
  private readonly normalBuffer: WebGLBuffer;
  private readonly uniformColor: WebGLUniformLocation;
  private readonly uniformWorldViewProjection: WebGLUniformLocation;
  private readonly uniformWorldInverseTranspose: WebGLUniformLocation;
  private readonly uniformReverseLightDirectionLocation: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext("webgl");
  }

  render(scene: Scene, camera: Camera) {
    const renderItems = this.toRenderItems(scene);
  }

  private toRenderItems(scene: Scene): RenderItems {
    const renderItems: RenderItems = { objects: [], lights: [] };
    this.addToRenderItems(scene, renderItems);
    return renderItems;
  }

  private addToRenderItems(object: AbstractObject, renderItems: RenderItems) {
    if (object.isLight) {
      renderItems.lights.push(object);
    } else {
      renderItems.objects.push(object);
    }
    object.children.forEach((child) =>
      this.addToRenderItems(child, renderItems)
    );
  }
}
