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
  private currentTimeout: number | null;

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
    this.currentSong = Math.floor(Math.random() * this.songs.length);
    this.playNextRandomSong();
  }

  private readonly playNextRandomSong = () => {
    // Stop any song that is currently playing
    if (this.isCurrentSongPlaying()) {
      this.songs[this.currentSong].audio.stop();
    }
    // Reset timeout if we change songs preemptively
    if (this.currentTimeout !== null) {
      clearTimeout(this.currentTimeout);
    }
    const nextIndex = this.getNextSongIndex();
    this.currentSong = nextIndex;
    const randomSong = this.songs[nextIndex];
    console.log(randomSong);
    this.setNewBPM(randomSong.bpm);
    randomSong.audio.play();
    // Set a timer if the current song finishes. The onEnded call is not reliable
    this.currentTimeout = window.setTimeout(() => {
      this.currentTimeout = null;
      if (this.isCurrentSongPlaying()) {
        this.playNextRandomSong();
      }
    }, randomSong.durationS * 1000 + 500);
    randomSong.audio.onEnded = this.playNextRandomSong;
  };

  private getNextSongIndex(): number {
    if (this.currentSong === null) {
      return Math.floor(Math.random() * this.songs.length);
    } else {
      return (this.currentSong + 1) % this.songs.length;
    }
  }

  private isCurrentSongPlaying(): boolean {
    return (
      this.currentSong !== null && this.songs[this.currentSong].audio.isPlaying
    );
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
