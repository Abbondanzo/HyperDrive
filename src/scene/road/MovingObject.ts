import { addSongSpeedListener, SongSpeedEvent } from "../../events/songSpeed";

export abstract class MovingObject {
  private static MS_PER_MINUTE = 60000;

  protected offsetMultiplier: number;
  protected offsetPerMS: number;

  constructor() {
    this.offsetMultiplier = 1;
    this.offsetPerMS = 0;
    addSongSpeedListener(this.handleSongSpeed);
  }

  private readonly handleSongSpeed = ({ bpm }: SongSpeedEvent) => {
    const newOffset =
      (bpm / MovingObject.MS_PER_MINUTE) * this.offsetMultiplier;
    this.offsetPerMS = newOffset;
  };
}
