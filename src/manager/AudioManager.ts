import { Audio, AudioAnalyser } from "three";

import { Song } from "../audio/songs";
import { addFrameListener } from "../events/frame";
import { addScreenAttachListener } from "../events/screenAttach";
import { dispatchSongFrequencyEvent } from "../events/songFrequency";
import { dispatchSongMetadataEvent } from "../events/songMetadata";
import { addSongMuteListener, SongMuteEvent } from "../events/songMute";
import {
  addSongPlayPauseListener,
  dispatchSongPlayPauseEvent,
  SongPlayPauseEvent,
} from "../events/songPlayPause";
import { addSongSkipListener } from "../events/songSkip";
import { dispatchSongSpeedEvent } from "../events/songSpeed";
import { SongSkipEvent } from "./../events/songSkip";

interface SongAudio extends Song {
  audio: Audio;
}

class AudioManager {
  private static PLAY_ON_START = true;
  private static CHANGE_INTERVAL = 50;
  private static FFT_SIZE = 2048;

  private songs: SongAudio[];
  private currentSong: number | null;
  private currentBPM: number;
  private analyser: AudioAnalyser | null;
  private bpmTimeout: number | null;

  constructor() {
    this.songs = [];
    this.currentBPM = 0;
    this.currentSong = null;
    this.analyser = null;
    dispatchSongSpeedEvent({ bpm: this.currentBPM });
    addFrameListener(this.handleFrame);
    addSongPlayPauseListener(this.handlePlayPause);
    addSongMuteListener(this.handleMute);
    addSongSkipListener(this.handleSkip);
    addScreenAttachListener(this.handleScreenAttach);
  }

  attach(songs: SongAudio[]) {
    this.songs = songs;
  }

  start(playOnStart: boolean = AudioManager.PLAY_ON_START) {
    if (this.songs.length === 0) {
      return;
    }

    if (playOnStart) {
      this.play();
    } else {
      dispatchSongPlayPauseEvent({ play: false });
      const nextIndex = this.getNextSongIndex();
      this.currentSong = nextIndex;
      this.setNewBPM(this.songs[nextIndex].bpm);
      dispatchSongMetadataEvent({ song: this.songs[this.currentSong] });
    }
  }

  private play() {
    if (this.songs.length === 0) {
      return;
    }
    if (this.currentSong !== null) {
      if (!this.isCurrentSongPlaying()) {
        this.startCurrentSong();
      }
    } else {
      this.currentSong = Math.floor(Math.random() * this.songs.length);
      this.startCurrentSong();
    }
  }

  private pause() {
    if (this.currentSong !== null && this.songs.length > 0) {
      this.getCurrentAudio()?.pause();
    }
    this.removeVisualization();
  }

  private stop() {
    if (this.isCurrentSongPlaying()) {
      this.getCurrentAudio()?.stop();
      this.removeVisualization();
    }
  }

  private removeVisualization() {
    this.analyser = null;
    dispatchSongFrequencyEvent({
      frequencyData: new Uint8Array(AudioManager.FFT_SIZE / 2),
      averageFrequency: 0,
    });
  }

  private playPrevious() {
    if (this.songs.length === 0) return;
    this.stop();
    let prevIndex = 0;
    if (this.currentSong !== null) {
      prevIndex =
        (this.currentSong - 1 + this.songs.length) % this.songs.length;
    }
    this.currentSong = prevIndex;
    this.startCurrentSong();
  }

  private playNext() {
    if (this.songs.length === 0) return;
    this.stop();
    const nextIndex = this.getNextSongIndex();
    this.currentSong = nextIndex;
    this.startCurrentSong();
  }

  private startCurrentSong() {
    const song = this.songs[this.currentSong];
    this.setNewBPM(song.bpm);
    song.audio.play();

    this.analyser = new AudioAnalyser(song.audio, AudioManager.FFT_SIZE);

    dispatchSongPlayPauseEvent({ play: true });
    dispatchSongMetadataEvent({ song: song });
    // Overrides the internal call to three. Need to set isPlaying manually
    song.audio.source.onended = () => {
      song.audio.isPlaying = false;
      this.playNext();
    };
  }

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

    if (this.bpmTimeout !== null) {
      clearTimeout(this.bpmTimeout);
    }

    this.bpmTimeout = window.setTimeout(() => {
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

  private readonly handleFrame = () => {
    if (this.analyser !== null) {
      dispatchSongFrequencyEvent({
        averageFrequency: this.analyser.getAverageFrequency(),
        frequencyData: this.analyser.getFrequencyData(),
      });
    }
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

  private readonly handleSkip = ({ direction }: SongSkipEvent) => {
    if (direction === "forward") {
      this.playNext();
    } else if (direction === "backward") {
      this.playPrevious();
    }
  };

  private readonly handleScreenAttach = () => {
    if (this.songs.length === 0 || this.currentSong === null) {
      return;
    }
    const song = this.songs[this.currentSong];
    dispatchSongMetadataEvent({ song });
  };
}

export default new AudioManager();
