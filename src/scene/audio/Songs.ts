import {
  Audio,
  AudioListener,
  AudioLoader,
  Camera,
  LoadingManager,
} from "three";

import { Song, songs } from "../../audio/songs";
import AudioManager from "../../manager/AudioManager";
import { SceneSubject } from "../SceneSubject";

export class Songs implements SceneSubject {
  name = "Songs";

  private static LOAD_REMAINDER_DELAY = 3000;

  private camera: Camera;
  private listener: AudioListener;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  async load(loadingManager: LoadingManager) {
    this.listener = new AudioListener();
    const loader = new AudioLoader(loadingManager);

    const randomSong = this.getRandomSongToLoad();
    const firstSong = await this.loadSong(loader, randomSong);
    AudioManager.attach([firstSong]);

    setTimeout(
      () => this.loadAllSongsInBackground(loader, firstSong),
      Songs.LOAD_REMAINDER_DELAY
    );
  }

  attach() {
    this.camera.add(this.listener);
  }

  private getRandomSongToLoad = (): Song => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  };

  private loadAllSongsInBackground = async (
    loader: AudioLoader,
    songToSkip: Song & { audio: Audio }
  ) => {
    const remainingSongs = songs.filter(
      (song) => song.name !== songToSkip.name
    );
    const loadedSongs = await Promise.all(
      remainingSongs.map((song) => this.loadSong(loader, song))
    );
    const newSongList = [songToSkip, ...loadedSongs];
    AudioManager.attach(newSongList);
  };

  private async loadSong(loader: AudioLoader, song: Song) {
    return loader.loadAsync(`songs/${song.filename}`).then((buffer) => {
      const audio = new Audio(this.listener);
      audio.setBuffer(buffer);
      audio.setLoop(false);
      // Assign duration based on buffer length
      if (audio.duration) {
        song.durationS = audio.duration;
      }
      return { ...song, audio };
    });
  }
}
