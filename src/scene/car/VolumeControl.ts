import {
  addLockedMousedownListener,
  LockedMousedownEvent,
} from "../../events/lockedMousedown";
import { dispatchSongVolumeEvent } from "../../events/songVolume";

export class VolumeControl {
  private static STORAGE_KEY = "hyperdrive-volume";
  private static MIN = 1;
  private static MAX = 10;
  private static DEFAULT = 10;

  readonly div: HTMLDivElement;

  private readonly down: HTMLButtonElement;
  private readonly up: HTMLButtonElement;
  private readonly level: HTMLSpanElement;

  private volume: number;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "volume-control"; // CSS affected

    this.volume = this.readStoredVolume();

    this.down = document.createElement("button");
    this.down.innerHTML = "<i class='fas fa-volume-down' />";
    this.down.title = "Decrease volume";
    this.down.addEventListener("click", this.onDownClick);
    this.div.appendChild(this.down);

    this.level = document.createElement("span");
    this.level.id = "volume-level"; // CSS affected
    this.div.appendChild(this.level);

    this.up = document.createElement("button");
    this.up.innerHTML = "<i class='fas fa-volume-up' />";
    this.up.title = "Increase volume";
    this.up.addEventListener("click", this.onUpClick);
    this.div.appendChild(this.up);

    this.render();
    dispatchSongVolumeEvent({ volume: this.volume });

    addLockedMousedownListener(this.handleLockedMousedown);
  }

  private readStoredVolume(): number {
    try {
      const stored = Number(localStorage.getItem(VolumeControl.STORAGE_KEY));
      if (
        Number.isInteger(stored) &&
        stored >= VolumeControl.MIN &&
        stored <= VolumeControl.MAX
      ) {
        return stored;
      }
    } catch {
      // localStorage may be unavailable (e.g. private browsing)
    }
    return VolumeControl.DEFAULT;
  }

  private setVolume(volume: number) {
    this.volume = Math.min(
      VolumeControl.MAX,
      Math.max(VolumeControl.MIN, volume),
    );
    try {
      localStorage.setItem(VolumeControl.STORAGE_KEY, `${this.volume}`);
    } catch {
      // localStorage may be unavailable (e.g. private browsing)
    }
    this.render();
    dispatchSongVolumeEvent({ volume: this.volume });
  }

  private render() {
    this.level.innerHTML = `${this.volume}`;
  }

  private readonly onDownClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    this.setVolume(this.volume - 1);
  };

  private readonly onUpClick = (event?: Event) => {
    event?.stopPropagation();
    event?.preventDefault();
    this.setVolume(this.volume + 1);
  };

  private readonly handleLockedMousedown = ({ x, y }: LockedMousedownEvent) => {
    if (this.isInBounds(x, y, this.down)) {
      this.onDownClick();
    } else if (this.isInBounds(x, y, this.up)) {
      this.onUpClick();
    }
  };

  private isInBounds(x: number, y: number, element: HTMLElement): boolean {
    const { top, bottom, left, right } = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }
}
