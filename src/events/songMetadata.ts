import { Song } from "./../audio/songs";
import EventBus from "./EventBus";

export interface SongMetadataEvent {
  song: Song;
}

const SONG_METADATA = "SONG_METADATA";

export const {
  addEventListener: addSongMetadataListener,
  removeEventListener: removeSongMetadataListener,
  dispatch: dispatchSongMetadataEvent,
} = EventBus.buildEvent<SongMetadataEvent>(SONG_METADATA);
