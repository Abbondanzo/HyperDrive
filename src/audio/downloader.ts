import fs from "fs";
import path from "path";
import youtubedl from "youtube-dl";

import { songs } from "./songs";

const SONG_PATH = "public/songs/";

const downloadSong = (filename: string, video: string) => {
  const output = path.join(SONG_PATH, filename);
  if (fs.existsSync(output)) {
    console.log(`${filename} already downloaded. Skipping`);
    return;
  }
  const dl = youtubedl(
    video,
    ["-x", "--extract-audio", "--audio-format", "mp3"],
    {}
  );
  const outputStream = fs.createWriteStream(output, { flags: "a" });
  dl.pipe(outputStream);
  dl.on("info", (info) => {
    console.log(`Download started for ${filename}`);
    console.log(`Remaining bytes on ${filename}: ${info.size}`);
  });
  dl.on("error", (err) => console.error(err));
  dl.on("end", () => console.log(`Finished downloading ${filename}`));
};

const download = () =>
  songs.forEach((song) => {
    downloadSong(song.filename, song.video);
  });

// Note: only run this from the root of the project
download();
