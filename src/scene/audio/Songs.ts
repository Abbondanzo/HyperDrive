import {
  Audio,
  AudioListener,
  AudioLoader,
  Camera,
  LoadingManager,
} from "three";

import { songs } from "../../audio/songs";
import AudioManager from "../../manager/AudioManager";
import { SceneSubject } from "../SceneSubject";

export class Songs implements SceneSubject {
  private camera: Camera;
  private listener: AudioListener;

  constructor(camera: Camera) {
    this.camera = camera;
  }

  async load(loadingManager: LoadingManager) {
    this.listener = new AudioListener();
    const loader = new AudioLoader(loadingManager);
    const promises = songs.map(async (song) => {
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
    });
    const songAudios = await Promise.all(promises);
    AudioManager.attach(songAudios);
  }

  attach() {
    this.camera.add(this.listener);
  }
}
