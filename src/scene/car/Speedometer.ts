import { addSongSpeedListener } from "../../events/songSpeed";
import { SongSpeedEvent } from "./../../events/songSpeed";

export class Speedometer {
  readonly div: HTMLDivElement;

  constructor() {
    this.div = document.createElement("div");
    this.div.id = "speedometer"; // CSS affected
    // Subscribers
    addSongSpeedListener(this.handleSongSpeed);
  }

  private assignSpeed(speed: number) {
    this.div.innerHTML = "";
    //
    const speedName = document.createElement("span");
    speedName.innerHTML = "Speed";
    this.div.appendChild(speedName);
    //
    const speedAmount = document.createElement("div");
    const numberSpan = document.createElement("span");
    numberSpan.id = "speed";
    numberSpan.innerHTML = `${speed}`;
    speedAmount.appendChild(numberSpan);
    const speedSuffix = document.createElement("span");
    speedSuffix.innerHTML = " bpm";
    speedAmount.appendChild(speedSuffix);
    this.div.appendChild(speedAmount);
  }

  private readonly handleSongSpeed = ({ bpm }: SongSpeedEvent) => {
    this.assignSpeed(bpm);
  };
}
