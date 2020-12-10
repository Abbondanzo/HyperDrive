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

export class ScreenDOM {
  readonly div: HTMLDivElement;
  private readonly metadata: HTMLDivElement;
  private readonly playPause: HTMLButtonElement;

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
    this.playPause = document.createElement("button");
    this.handleSongPlayPause({ play: false });
    this.setPlayControls();
    // Subscribers
    dispatchScreenAttachEvent({ screen: this.div });
    addSongMetadataListener(this.handleSongMetadata);
    addSongPlayPauseListener(this.handleSongPlayPause);
  }

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

  private setPlayControls() {
    const controls = document.createElement("div");
    controls.id = "song-controls";
    // Back
    const back = document.createElement("button");
    back.innerHTML = "<i class='fas fa-backward' />";
    back.addEventListener("click", this.onSkipBackwardClick);
    controls.appendChild(back);
    // Play/pause
    this.playPause.addEventListener("click", this.onPlayPauseClick);
    controls.appendChild(this.playPause);
    // Forward
    const forward = document.createElement("button");
    forward.innerHTML = "<i class='fas fa-forward' />";
    forward.addEventListener("click", this.onSkipForwardClick);
    controls.appendChild(forward);
    //
    this.div.appendChild(controls);
  }

  private readonly onSkipBackwardClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("back");
  };

  private readonly onPlayPauseClick = (event: Event) => {
    // event.stopPropagation();
    // event.preventDefault();
    dispatchSongPlayPauseEvent({ play: !this.playing });
  };

  private readonly onSkipForwardClick = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("forward");
  };

  private readonly handleSongMetadata = ({ song }: SongMetadataEvent) => {
    this.setSongInfo(song.artist, song.name);
  };

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
