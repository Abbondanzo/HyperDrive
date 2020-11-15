import EventBus from "./EventBus";

export interface SongPlayPauseEvent {
  play: boolean;
}

const SONG_PLAY_PAUSE = "SONG_PLAY_PAUSE";

export const {
  addEventListener: addSongPlayPauseListener,
  removeEventListener: removeSongPlayPauseListener,
  dispatch: dispatchSongPlayPauseEvent,
} = EventBus.buildEvent<SongPlayPauseEvent>(SONG_PLAY_PAUSE);
