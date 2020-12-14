import EventBus from "./EventBus";

export interface SongFrequencyEvent {
  frequencyData: Uint8Array;
  averageFrequency: number;
}

const SONG_FREQUENCY = "SONG_FREQUENCY";

export const {
  addEventListener: addSongFrequencyListener,
  removeEventListener: removeSongFrequencyListener,
  dispatch: dispatchSongFrequencyEvent,
} = EventBus.buildEvent<SongFrequencyEvent>(SONG_FREQUENCY);
