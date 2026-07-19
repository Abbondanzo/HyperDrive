import fs from "fs";
import path from "path";
import youtubedl from "youtube-dl-exec";

import { songs } from "./songs";

const SONG_PATH = "public/songs/";

const downloadSong = async (filename: string, video: string) => {
  const output = path.join(SONG_PATH, filename);
  if (fs.existsSync(output)) {
    console.log(`${filename} already downloaded. Skipping`);
    return;
  }
  console.log(`Download started for ${filename}`);
  await youtubedl(video, {
    extractAudio: true,
    audioFormat: "mp3",
    output,
  });
  console.log(`Finished downloading ${filename}`);
};

const download = async () => {
  for (const song of songs) {
    await downloadSong(song.filename, song.video);
  }
};

// Note: only run this from the root of the project
download().catch((err) => console.error(err));
