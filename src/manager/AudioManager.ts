import { Audio } from "three";

import { Song } from "../audio/songs";
import { addSongMuteListener, SongMuteEvent } from "../events/songMute";
import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
  SongPlayPauseEvent,
} from "../events/songPlayPause";
import { dispatchSongSpeedEvent } from "../events/songSpeed";

interface SongAudio extends Song {
  audio: Audio;
}

class AudioManager {
  private static PLAY_ON_START = true;
  private static CHANGE_INTERVAL = 50;
  private static PER_SONG_DELAY = 500;

  private songs: SongAudio[];
  private currentSong: number | null;
  private currentBPM: number;
  private currentTimeout: number | null;

  constructor() {
    this.songs = [];
    this.currentBPM = 0;
    this.currentSong = null;
    dispatchSongSpeedEvent({ bpm: this.currentBPM });
    addSongPlayPauseListener(this.handlePlayPause);
    addSongMuteListener(this.handleMute);
  }

  attach(songs: SongAudio[]) {
    this.songs = songs;
  }

  start() {
    if (AudioManager.PLAY_ON_START) {
      dispatchSongPlayPauseEvent({ play: true });
      this.play();
    } else {
      dispatchSongPlayPauseEvent({ play: false });
      const nextIndex = this.getNextSongIndex();
      this.currentSong = nextIndex;
      this.setNewBPM(this.songs[nextIndex].bpm);
    }
  }

  private play() {
    if (this.songs.length === 0) {
      return;
    }
    if (this.currentSong !== null) {
      if (!this.isCurrentSongPlaying()) {
        this.getCurrentAudio()?.play();
      }
    } else {
      this.currentSong = Math.floor(Math.random() * this.songs.length);
      this.playNextRandomSong();
    }
  }

  private pause() {
    if (this.currentSong !== null && this.songs.length > 0) {
      this.getCurrentAudio()?.pause();
    }
  }

  private readonly playNextRandomSong = () => {
    // Stop any song that is currently playing
    if (this.isCurrentSongPlaying()) {
      this.getCurrentAudio()?.stop();
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
      this.playNextRandomSong();
    }, randomSong.durationS * 1000 + AudioManager.PER_SONG_DELAY);
  };

  private getNextSongIndex(): number {
    if (this.currentSong === null) {
      return Math.floor(Math.random() * this.songs.length);
    } else {
      return (this.currentSong + 1) % this.songs.length;
    }
  }

  private getCurrentAudio(): Audio | null {
    return this.currentSong !== null && this.songs.length > 0
      ? this.songs[this.currentSong].audio
      : null;
  }

  private isCurrentSongPlaying(): boolean {
    return this.getCurrentAudio()?.isPlaying || false;
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

  private readonly handlePlayPause = ({ play }: SongPlayPauseEvent) => {
    if (play) {
      this.play();
    } else {
      this.pause();
    }
  };

  private readonly handleMute = ({ muted }: SongMuteEvent) => {
    const currentAudio = this.getCurrentAudio();
    if (muted) {
      currentAudio?.setVolume(0);
    } else {
      currentAudio.setVolume(1);
    }
  };
}

export default new AudioManager();
