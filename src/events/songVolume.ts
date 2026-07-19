import EventBus from "./EventBus";

export interface SongVolumeEvent {
  volume: number;
}

const SONG_VOLUME = "SONG_VOLUME";

export const {
  addEventListener: addSongVolumeListener,
  removeEventListener: removeSongVolumeListener,
  dispatch: dispatchSongVolumeEvent,
} = EventBus.buildEvent<SongVolumeEvent>(SONG_VOLUME);
