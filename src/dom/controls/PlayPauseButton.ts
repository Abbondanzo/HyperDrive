import "@fortawesome/fontawesome-free/js/all";

import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
  SongPlayPauseEvent,
} from "../../events/songPlayPause";

export class PlayPauseButton {
  readonly button: HTMLButtonElement;

  private play: boolean;

  constructor() {
    this.button = document.createElement("button");
    this.button.id = "play-pause";
    this.button.addEventListener("click", this.handleClick);
    this.handleSongPlayPause({ play: true });
    addSongPlayPauseListener(this.handleSongPlayPause);
  }

  private readonly handleClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatchSongPlayPauseEvent({ play: !this.play });
  };

  private readonly handleSongPlayPause = ({ play }: SongPlayPauseEvent) => {
    this.play = play;
    if (play) {
      this.button.innerHTML = "<i class='fas fa-pause' />";
      this.button.title = "Pause";
    } else {
      this.button.innerHTML = "<i class='fas fa-play' />";
      this.button.title = "Play";
    }
  };
}
