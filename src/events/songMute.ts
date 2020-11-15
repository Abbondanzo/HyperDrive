import EventBus from "./EventBus";

export interface SongMuteEvent {
  muted: boolean;
}

const SONG_MUTE = "SONG_MUTE";

export const {
  addEventListener: addSongMuteListener,
  removeEventListener: removeSongMuteListener,
  dispatch: dispatchSongMuteEvent,
} = EventBus.buildEvent<SongMuteEvent>(SONG_MUTE);
