import { addLockedMousedownListener } from "../../events/lockedMousedown";
import { dispatchScreenAttachEvent } from "../../events/screenAttach";
import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
} from "../../events/songPlayPause";
import {
  addSongMetadataListener,
  SongMetadataEvent,
} from "./../../events/songMetadata";
import { SongPlayPauseEvent } from "./../../events/songPlayPause";
import { LockedMousedownEvent } from "./../../events/lockedMousedown";

export class ScreenDOM {
  readonly div: HTMLDivElement;
  private readonly metadata: HTMLDivElement;
  // Controls
  private readonly back: HTMLButtonElement;
  private readonly playPause: HTMLButtonElement;
  private readonly forward: HTMLButtonElement;

  private playing: boolean;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "screen"; // CSS affected
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
    addSongMetadataListener(this.handleSongMetadata);
    addSongPlayPauseListener(this.handleSongPlayPause);
  }

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
  }

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
    console.log("back");
  };

  private readonly onPlayPauseClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    dispatchSongPlayPauseEvent({ play: !this.playing });
  };

  private readonly onSkipForwardClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    console.log("forward");
  };

  private readonly handleLockedMousedown = ({ x, y }: LockedMousedownEvent) => {
    console.log(this.isInBounds(x, y, this.playPause));
    console.log(this.isInBounds(x, y, this.back));
    console.log(this.isInBounds(x, y, this.forward));
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
