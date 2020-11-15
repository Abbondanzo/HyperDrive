import { Audio } from "three";

import { Song } from "../audio/songs";
import { dispatchSongSpeedEvent } from "../events/songSpeed";

interface SongAudio extends Song {
  audio: Audio;
}

class AudioManager {
  private static CHANGE_INTERVAL = 50;

  private songs: SongAudio[];
  private currentSong: number | null;
  private currentBPM: number;

  constructor() {
    this.songs = [];
    this.currentBPM = 0;
    this.currentSong = null;
    dispatchSongSpeedEvent({ bpm: this.currentBPM });
  }

  attach(songs: SongAudio[]) {
    this.songs = songs;
  }

  play() {
    if (this.currentSong !== null) {
      return;
    }
    this.playNextRandomSong();
  }

  private readonly playNextRandomSong = () => {
    if (this.currentSong !== null) {
      if (this.songs[this.currentSong].audio.isPlaying) {
        this.songs[this.currentSong].audio.stop();
      }
    }
    const nextIndex = this.getRandomSongIndex();
    this.currentSong = nextIndex;
    const randomSong = this.songs[nextIndex];
    this.setNewBPM(randomSong.bpm);
    randomSong.audio.play();
    randomSong.audio.onEnded = this.playNextRandomSong;
  };

  private getRandomSongIndex(): number {
    let randomIndex = Math.floor(Math.random() * this.songs.length);
    while (this.songs.length > 0 && randomIndex === this.currentSong)
      randomIndex = Math.floor(Math.random() * this.songs.length);
    return randomIndex;
  }

  private readonly setNewBPM = (newBPM: number) => {
    if (this.currentBPM === 0) {
      this.currentBPM = newBPM;
      dispatchSongSpeedEvent({ bpm: this.currentBPM });
      return;
    }

    setTimeout(() => {
      if (newBPM > this.currentBPM) {
        this.currentBPM += 1;
        dispatchSongSpeedEvent({ bpm: this.currentBPM });
        this.setNewBPM(newBPM);
      } else if (newBPM < this.currentBPM) {
        this.currentBPM -= 1;
        dispatchSongSpeedEvent({ bpm: this.currentBPM });
        this.setNewBPM(newBPM);
      }
    }, AudioManager.CHANGE_INTERVAL);
  };
}

export default new AudioManager();
