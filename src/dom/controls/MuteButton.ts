import "@fortawesome/fontawesome-free/js/all";

import {
  addSongMuteListener,
  dispatchSongMuteEvent,
  SongMuteEvent,
} from "../../events/songMute";

export class MuteBotton {
  readonly button: HTMLButtonElement;

  private muted: boolean;

  constructor() {
    this.button = document.createElement("button");
    this.button.id = "mute";
    this.button.addEventListener("click", this.handleClick);
    this.handleSongMute({ muted: false });
    addSongMuteListener(this.handleSongMute);
  }

  private readonly handleClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatchSongMuteEvent({ muted: !this.muted });
  };

  private readonly handleSongMute = ({ muted }: SongMuteEvent) => {
    this.muted = muted;
    this.button.title = "Toggle volume";
    if (muted) {
      this.button.innerHTML = "<i class='fas fa-volume-mute' />";
    } else {
      this.button.innerHTML = "<i class='fas fa-volume-up' />";
    }
  };
}
