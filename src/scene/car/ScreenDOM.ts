import { Object3D } from "three";

import { addLockedMousemoveListener } from "../../events/lockedMousemove";
import { dispatchScreenAttachEvent } from "../../events/screenAttach";
import CameraManager from "../../manager/CameraManager";
import { SongControls } from "./SongControls";
import { SongMetadata } from "./SongMetadata";
import { Speedometer } from "./Speedometer";

export class ScreenDOM {
  readonly div: HTMLDivElement;

  private readonly lockPointer: HTMLDivElement;
  private intersectObject: Object3D | null;

  private readonly speedometer: Speedometer;
  private readonly metadata: SongMetadata;
  private readonly controls: SongControls;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "screen"; // CSS affected
    //
    this.intersectObject = null;
    this.lockPointer = document.createElement("div");
    this.lockPointer.id = "lockpointer";
    this.lockPointer.classList.add("hidden");
    document.body.appendChild(this.lockPointer);
    //
    this.speedometer = new Speedometer();
    this.div.appendChild(this.speedometer.div);
    this.appendDivider();
    //
    this.metadata = new SongMetadata();
    this.div.appendChild(this.metadata.div);
    //
    this.controls = new SongControls();
    this.div.appendChild(this.controls.div);
    // Subscribers
    dispatchScreenAttachEvent({ screen: this.div });
    addLockedMousemoveListener(this.checkScreenIntersect);
  }

  setIntersect(object: Object3D) {
    this.intersectObject = object;
  }

  private appendDivider() {
    const divider = document.createElement("hr");
    divider.className = "divider";
    this.div.appendChild(divider);
  }

  private readonly checkScreenIntersect = () => {
    if (this.intersectObject === null) return;
    const intersects = CameraManager.raycaster.intersectObject(
      this.intersectObject
    );
    if (intersects.length > 0) {
      this.lockPointer.classList.remove("hidden");
    } else {
      this.lockPointer.classList.add("hidden");
    }
  };
}
