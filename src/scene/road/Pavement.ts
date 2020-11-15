import {
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  Texture,
  TextureLoader,
} from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { addSongSpeedListener, SongSpeedEvent } from "../../events/songSpeed";
import { SceneSubject } from "../SceneSubject";

export class Pavement implements SceneSubject {
  private static MS_PER_MINUTE = 60000;
  private static NINTETY_DEGREES = Math.PI / 2;
  private static DISTANCE = 2000;

  private height: number;
  private width: number;

  private plane: Mesh;
  private texture: Texture;

  private offsetPerMS: number;

  constructor() {
    this.height = 10;
    this.width = this.height + Pavement.DISTANCE;
    this.offsetPerMS = 0;
    addFrameListener(this.handleFrame);
    addSongSpeedListener(this.handleSongSpeed);
  }

  async load(loadingManager: LoadingManager) {
    this.texture = await new TextureLoader(loadingManager).loadAsync(
      "textures/road/pavement.png"
    );
    // Apply wrapping to texture so it fits in the correct scale. Width is always greater
    this.texture.wrapS = RepeatWrapping;
    this.texture.repeat.set(this.width / this.height, 1);
    this.texture.anisotropy = 16;
    const material = new MeshBasicMaterial({
      map: this.texture,
    });
    const geometry = new PlaneGeometry(this.width, this.height, 32);
    this.plane = new Mesh(geometry, material);
    // Offset from car
    this.plane.position.x = -1.5;
    this.plane.position.y = -1.5;
    // Rotate so lengthwise
    this.plane.rotation.x = -Pavement.NINTETY_DEGREES;
    this.plane.rotation.z = Pavement.NINTETY_DEGREES;
  }

  attach(scene: Scene) {
    scene.add(this.plane);
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const newOffset = (this.texture.offset.x + delta * this.offsetPerMS) % 1;
    this.texture.offset.x = newOffset;
  };

  private readonly handleSongSpeed = ({ bpm }: SongSpeedEvent) => {
    const newOffset = bpm / Pavement.MS_PER_MINUTE;
    this.offsetPerMS = newOffset;
  };
}
