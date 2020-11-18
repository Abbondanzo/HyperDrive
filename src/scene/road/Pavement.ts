import {
  LoadingManager,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { SceneSubject } from "../SceneSubject";
import { MovingObject } from "./MovingObject";

export class Pavement extends MovingObject implements SceneSubject {
  name = "Pavement";

  static SQUARE_SIZE = 10;
  static OFFSET_MULTIPLIER = 2;

  private static NINTETY_DEGREES = Math.PI / 2;
  private static DISTANCE = 600;

  private height: number;
  private width: number;

  private plane: Mesh;
  private texture: Texture;

  constructor() {
    super();
    this.height = Pavement.SQUARE_SIZE;
    this.width = this.height + Pavement.DISTANCE;
    this.offsetMultiplier = Pavement.OFFSET_MULTIPLIER;
    addFrameListener(this.handleFrame);
  }

  async load(loadingManager: LoadingManager) {
    this.texture = await new TextureLoader(loadingManager).loadAsync(
      "textures/road/pavement.png"
    );
    // Apply wrapping to texture so it fits in the correct scale. Width is always greater
    this.texture.wrapS = RepeatWrapping;
    this.texture.repeat.set(this.width / this.height, 1);
    this.texture.anisotropy = 16;
    const material = new MeshPhongMaterial({
      map: this.texture,
      shininess: 0,
    });
    const geometry = new PlaneGeometry(this.width, this.height, 32);
    this.plane = new Mesh(geometry, material);
    // Rotate so lengthwise
    this.plane.rotation.x = -Pavement.NINTETY_DEGREES;
    this.plane.rotation.z = Pavement.NINTETY_DEGREES;
  }

  attach(parent: Object3D) {
    parent.add(this.plane);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const newOffset = (this.texture.offset.x + delta * this.offsetPerMS) % 1;
    this.texture.offset.x = newOffset;
  };
}
