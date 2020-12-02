export interface Song {
  bpm: number;
  durationS: number; // in seconds
  name: string;
  artist: string;
  filename: string;
  camelot: string; // Used for mixing songs with the same key
  video: string;
}

// https://tunebat.com/Info/Now-or-Never-You-and-Me-Dan-Mason-/1LPyWPhlOAjSFDfj5yhhWH
const DAN_MASON_NOW_OR_NEVER: Song = {
  name: "Now or Never (You and Me)",
  artist: "Dan Mason",
  bpm: 88,
  durationS: 286,
  filename: "dan_mason_now_or_never.mp3",
  camelot: "4A",
  video: "https://youtube.com/watch?v=B-DnLyT1pOc",
};

// https://tunebat.com/Info/22-39-Danger/5PDKajOvt9yMVCsgQhYcMn
const DANGER_2239: Song = {
  name: "22:39",
  artist: "Danger",
  bpm: 118,
  durationS: 252,
  filename: "danger_2239.mp3",
  camelot: "3A",
  video: "https://youtube.com/watch?v=S7Q7lpA5I9E",
};

// https://tunebat.com/Info/Head-First-Home/3tjwjBfPO1pyjhnrI0J5Nq
const HOME_HEAD_FIRST: Song = {
  name: "Head First",
  artist: "Home",
  bpm: 134,
  durationS: 213,
  filename: "home_head_first.mp3",
  camelot: "4A",
  video: "https://youtube.com/watch?v=zeiwxt0EP4s",
};

// https://tunebat.com/Info/Resonance-Home/1TuopWDIuDi1553081zvuU
const HOME_RESONANCE: Song = {
  name: "Resonance",
  artist: "Home",
  bpm: 170,
  durationS: 212,
  filename: "home_resonance.mp3",
  camelot: "4B",
  video: "https://youtube.com/watch?v=8GW6sLrK40k",
};

// https://tunebat.com/Info/Over-Easy-Stst/5TrTRbz0W5deKf9EZJ4DRp
const OVER_EASY: Song = {
  name: "Over Easy",
  artist: "Stst",
  bpm: 122,
  durationS: 163,
  filename: "stst_over_easy.mp3",
  camelot: "9B",
  video: "https://www.youtube.com/watch?v=Z6mxU1cMsCo",
};

export const songs = [
  HOME_RESONANCE,
  DAN_MASON_NOW_OR_NEVER,
  HOME_HEAD_FIRST,
  DANGER_2239,
  OVER_EASY,
];
