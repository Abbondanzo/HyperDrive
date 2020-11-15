import { dispatchSongSpeedEvent } from "../events/songSpeed";

class AudioManager {
  constructor() {}

  play() {
    dispatchSongSpeedEvent({ bpm: 134 });
  }
}

export default new AudioManager();
