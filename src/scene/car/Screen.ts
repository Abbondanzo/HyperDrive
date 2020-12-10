import { LoadingManager, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { dispatchScreenAttachEvent } from "../../events/screenAttach";
import { addSongMetadataListener } from "../../events/songMetadata";
import CameraManager from "../../manager/CameraManager";

import { SceneSubject } from "./../SceneSubject";
import { SongMetadataEvent } from "./../../events/songMetadata";

export class Screen implements SceneSubject {
  name = "Screen";

  // Should match CameraManager.CSS_DISTANCE
  private static CSS_DISTANCE = 500;

  private object: Object3D;
  private readonly div: HTMLDivElement;
  private readonly metadata: HTMLDivElement;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "screen";
    this.metadata = document.createElement("div");
    this.metadata.id = "song-metadata";
    this.div.appendChild(this.metadata);
    this.setSongInfo("No Artist", "No Song Name");
    // Subscribers
    dispatchScreenAttachEvent({ screen: this.div });
    addSongMetadataListener(this.handleSongMetadata);
  }

  async load(loadingManager: LoadingManager) {
    this.object = new Object3D();
    const css3dObject = new CSS3DObject(this.div);
    this.object.add(css3dObject);
  }

  attach(parent: Object3D) {
    this.copyWorldPosition(parent as Mesh, this.object);
    // this.object.position.z = -200;
    // this.object.rotateX(-0.3);
    this.object.updateWorldMatrix(false, true);
    // this.object.matrixWorldNeedsUpdate = true;
    parent.add(this.object);
  }

  private copyWorldPosition(source: Mesh, dest: Object3D) {
    // Whole lotta guess-and-check
    const pos = new Vector3(0.685, -0.49, -0.1).multiplyScalar(
      Screen.CSS_DISTANCE
    );
    dest.position.set(pos.x, pos.y, pos.z);
    // Rotation
    const rotationX = this.getXRotation(source);
    dest.rotateX(rotationX);
    // Sizing
    this.applyScale(source);
    // For update
    dest.updateMatrix();
  }

  private applyScale(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    const deltaX = Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    this.div.style.width = `${deltaX * 2 * Screen.CSS_DISTANCE}px`;
    this.div.style.height = `${deltaY * 2.35 * Screen.CSS_DISTANCE}px`;
  }

  // Get X rotation in radians
  private getXRotation(source: Mesh) {
    const { max, min } = source.geometry.boundingBox;
    // Why 1.21? Why not?
    const deltaX = 1.21 * Math.abs(max.x - min.x);
    const deltaY = Math.abs(max.y - min.y);
    return -Math.atan(deltaX / deltaY);
  }

  private setSongInfo(artist: string, name: string) {
    // Reset metadata
    this.metadata.innerHTML = "";
    // Assign artist
    const artistDiv = document.createElement("span");
    artistDiv.id = "song-artist";
    artistDiv.innerHTML = artist;
    this.metadata.appendChild(artistDiv);
    // Assign name
    const nameDiv = document.createElement("span");
    nameDiv.id = "song-name";
    nameDiv.innerHTML = name;
    this.metadata.appendChild(nameDiv);
  }

  private readonly handleSongMetadata = ({ song }: SongMetadataEvent) => {
    this.setSongInfo(song.artist, song.name);
  };
}
