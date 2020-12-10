import EventBus from "./EventBus";

export interface SongSkipEvent {
  direction: "forward" | "backward";
}

const SONG_SKIP = "SONG_SKIP";

export const {
  addEventListener: addSongSkipListener,
  removeEventListener: removeSongSkipListener,
  dispatch: dispatchSongSkipEvent,
} = EventBus.buildEvent<SongSkipEvent>(SONG_SKIP);
