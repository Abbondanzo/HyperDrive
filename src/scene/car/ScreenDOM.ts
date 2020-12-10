import { Object3D } from "three";

import { addLockedMousedownListener } from "../../events/lockedMousedown";
import { addLockedMousemoveListener } from "../../events/lockedMousemove";
import { dispatchScreenAttachEvent } from "../../events/screenAttach";
import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
} from "../../events/songPlayPause";
import { dispatchSongSkipEvent } from "../../events/songSkip";
import CameraManager from "../../manager/CameraManager";
import { LockedMousedownEvent } from "./../../events/lockedMousedown";
import {
  addSongMetadataListener,
  SongMetadataEvent,
} from "./../../events/songMetadata";
import { SongPlayPauseEvent } from "./../../events/songPlayPause";

export class ScreenDOM {
  private static NAME_SCROLL_OFFSET_MS = 8000;

  readonly div: HTMLDivElement;

  private readonly lockPointer: HTMLDivElement;
  private readonly metadata: HTMLDivElement;
  // Controls
  private readonly back: HTMLButtonElement;
  private readonly playPause: HTMLButtonElement;
  private readonly forward: HTMLButtonElement;

  private playing: boolean;
  private intersectObject: Object3D | null;
  private songNameOffset: number | null;

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
    this.metadata = document.createElement("div");
    this.metadata.id = "song-metadata"; // CSS affected
    this.div.appendChild(this.metadata);
    this.setSongInfo("No Artist", "No Song Name");
    //
    this.back = document.createElement("button");
    this.playPause = document.createElement("button");
    this.forward = document.createElement("button");
    this.handleSongPlayPause({ play: false });
    this.setPlayControls();
    // Subscribers
    dispatchScreenAttachEvent({ screen: this.div });
    addLockedMousedownListener(this.handleLockedMousedown);
    addLockedMousemoveListener(this.checkScreenIntersect);
    addSongMetadataListener(this.handleSongMetadata);
    addSongPlayPauseListener(this.handleSongPlayPause);
  }

  setIntersect(object: Object3D) {
    this.intersectObject = object;
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

  /**
   * ========================
   * Song Info
   * ========================
   */

  private setSongInfo(artist: string, name: string) {
    // Reset metadata
    this.metadata.innerHTML = "";
    // Assign artist
    const artistDiv = document.createElement("span");
    artistDiv.id = "song-artist"; // CSS affected
    artistDiv.innerHTML = artist;
    this.metadata.appendChild(artistDiv);
    // Assign name
    const nameDiv = document.createElement("span");
    nameDiv.id = "song-name"; // CSS affected
    nameDiv.innerHTML = name;
    this.metadata.appendChild(nameDiv);
    this.checkSongNameOffset(nameDiv);
  }

  private checkSongNameOffset(element: HTMLElement) {
    clearTimeout(this.songNameOffset);
    this.showNameDiff(element);
  }

  private readonly showNameDiff = (element: HTMLElement) => {
    const diff = element.offsetWidth - element.parentElement.offsetWidth;
    if (diff <= 0) {
      return;
    }
    element.style.transform = `translateX(-${diff}px)`;
    this.songNameOffset = window.setTimeout(
      () => this.hideNameDiff(element),
      ScreenDOM.NAME_SCROLL_OFFSET_MS
    );
  };

  private readonly hideNameDiff = (element: HTMLElement) => {
    element.style.transform = `translateX(0px)`;
    this.songNameOffset = window.setTimeout(
      () => this.showNameDiff(element),
      ScreenDOM.NAME_SCROLL_OFFSET_MS
    );
  };

  private readonly handleSongMetadata = ({ song }: SongMetadataEvent) => {
    this.setSongInfo(song.artist, song.name);
  };

  /**
   * ========================
   * Song Controls
   * ========================
   */

  private setPlayControls() {
    const controls = document.createElement("div");
    controls.id = "song-controls";
    // Back
    this.back.innerHTML = "<i class='fas fa-backward' />";
    this.back.addEventListener("click", this.onSkipBackwardClick);
    controls.appendChild(this.back);
    // Play/pause
    this.playPause.addEventListener("click", this.onPlayPauseClick);
    controls.appendChild(this.playPause);
    // Forward
    this.forward.innerHTML = "<i class='fas fa-forward' />";
    this.forward.addEventListener("click", this.onSkipForwardClick);
    controls.appendChild(this.forward);
    //
    this.div.appendChild(controls);
  }

  private readonly onSkipBackwardClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    dispatchSongSkipEvent({ direction: "backward" });
  };

  private readonly onPlayPauseClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    dispatchSongPlayPauseEvent({ play: !this.playing });
  };

  private readonly onSkipForwardClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    dispatchSongSkipEvent({ direction: "forward" });
  };

  private readonly handleLockedMousedown = ({ x, y }: LockedMousedownEvent) => {
    if (this.isInBounds(x, y, this.playPause)) {
      this.onPlayPauseClick();
    } else if (this.isInBounds(x, y, this.back)) {
      this.onSkipBackwardClick();
    } else if (this.isInBounds(x, y, this.forward)) {
      this.onSkipForwardClick();
    }
  };

  private isInBounds(x: number, y: number, element: HTMLElement): boolean {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private readonly handleSongPlayPause = ({ play }: SongPlayPauseEvent) => {
    this.playing = play;
    if (play) {
      this.playPause.innerHTML = "<i class='fas fa-pause' />";
      this.playPause.title = "Pause";
    } else {
      this.playPause.innerHTML = "<i class='fas fa-play' />";
      this.playPause.title = "Play";
    }
  };

  /**
   * ========================
   * Song Visualization
   * ========================
   */
}
