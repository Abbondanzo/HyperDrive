import {
  addSongMetadataListener,
  SongMetadataEvent,
} from "../../events/songMetadata";

export class SongMetadata {
  private static NAME_SCROLL_OFFSET_MS = 8000;

  readonly div: HTMLDivElement;
  private songNameOffset: number | null;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "song-metadata"; // CSS affected
    this.setSongInfo("No Artist", "No Song Name");
    // Subscribers
    addSongMetadataListener(this.handleSongMetadata);
  }

  private setSongInfo(artist: string, name: string) {
    // Reset metadata
    this.div.innerHTML = "";
    // Assign artist
    const artistDiv = document.createElement("span");
    artistDiv.id = "song-artist"; // CSS affected
    artistDiv.innerHTML = artist;
    this.div.appendChild(artistDiv);
    // Assign name
    const nameDiv = document.createElement("span");
    nameDiv.id = "song-name"; // CSS affected
    nameDiv.innerHTML = name;
    this.div.appendChild(nameDiv);
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
    element.style.transform = `translateX(-${diff + 8}px)`;
    this.songNameOffset = window.setTimeout(
      () => this.hideNameDiff(element),
      SongMetadata.NAME_SCROLL_OFFSET_MS
    );
  };

  private readonly hideNameDiff = (element: HTMLElement) => {
    element.style.transform = `translateX(0px)`;
    this.songNameOffset = window.setTimeout(
      () => this.showNameDiff(element),
      SongMetadata.NAME_SCROLL_OFFSET_MS
    );
  };

  private readonly handleSongMetadata = ({ song }: SongMetadataEvent) => {
    this.setSongInfo(song.artist, song.name);
  };
}
