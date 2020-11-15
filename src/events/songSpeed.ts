import EventBus from "./EventBus";

export interface SongSpeedEvent {
  bpm: number;
}

const SONG_SPEED = "SONG_SPEED";

export const {
  addEventListener: addSongSpeedListener,
  removeEventListener: removeSongSpeedListener,
  dispatch: dispatchSongSpeedEvent,
} = EventBus.buildEvent<SongSpeedEvent>(SONG_SPEED);
