import {
  addLockedMousedownListener,
  LockedMousedownEvent,
} from "../../events/lockedMousedown";
import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
  SongPlayPauseEvent,
} from "../../events/songPlayPause";
import { dispatchSongSkipEvent } from "../../events/songSkip";

export class SongControls {
  readonly div: HTMLDivElement;

  private readonly back: HTMLButtonElement;
  private readonly playPause: HTMLButtonElement;
  private readonly forward: HTMLButtonElement;

  private playing: boolean;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "song-controls"; // CSS affected
    //
    this.back = document.createElement("button");
    this.playPause = document.createElement("button");
    this.forward = document.createElement("button");
    this.handleSongPlayPause({ play: false });
    this.setPlayControls();
    // Subscribers
    addLockedMousedownListener(this.handleLockedMousedown);
    addSongPlayPauseListener(this.handleSongPlayPause);
  }

  private setPlayControls() {
    // Back
    this.back.innerHTML = "<i class='fas fa-backward' />";
    this.back.addEventListener("click", this.onSkipBackwardClick);
    this.div.appendChild(this.back);
    // Play/pause
    this.playPause.addEventListener("click", this.onPlayPauseClick);
    this.playPause.id = "song-playpause"; // CSS affected
    this.div.appendChild(this.playPause);
    // Forward
    this.forward.innerHTML = "<i class='fas fa-forward' />";
    this.forward.addEventListener("click", this.onSkipForwardClick);
    this.div.appendChild(this.forward);
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
}
