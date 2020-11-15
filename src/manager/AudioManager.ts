import { Audio } from "three";

import { Song } from "../audio/songs";
import { dispatchSongSpeedEvent } from "../events/songSpeed";

interface SongAudio extends Song {
  audio: Audio;
}

class AudioManager {
  private songs: SongAudio[];
  private currentSong: number | null;

  constructor() {
    this.songs = [];
    this.currentSong = null;
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
    const randomSong = this.songs[this.getRandomSongIndex()];
    dispatchSongSpeedEvent({ bpm: randomSong.bpm });
    randomSong.audio.play();
    randomSong.audio.onEnded = this.playNextRandomSong;
  };

  private getRandomSongIndex(): number {
    let randomIndex = Math.floor(Math.random() * this.songs.length);
    while (this.songs.length > 0 && randomIndex === this.currentSong)
      randomIndex = Math.floor(Math.random() * this.songs.length);
    return randomIndex;
  }
}

export default new AudioManager();
