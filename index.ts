import prompt from "./src/prompt";
import {downloadVideo} from "./src/downloader";
import {playlistDL} from "./src/playlist";
import * as readline from "node:readline";
import ytdl from "@distube/ytdl-core";
import fs from "node:fs";

const sleep = (sec: number) => {
  return new Promise(resolve => setTimeout(resolve, sec *1000));
}
const main = async () => {
  const cookie = JSON.parse(fs.readFileSync('cookies.json', "utf-8")).cookies
  const agent = ytdl.createAgent(cookie)
  const {url : inputURL} = await prompt.inputUrl()

  // activate code comment below to using youtube video download and disabled the code for playlist download
  // Youtube Video Download
  // await downloadVideo(agent, inputURL, 'downloaded/');



  // activate code comment below to using youtube playlist download and disabled the code for video download
  // Playlist Download
  const list = await playlistDL(inputURL);
  const total = list.length
  let downloaded = 1
  for (let i = 0; i < list.length; i++) {
    try {
      readline.cursorTo(process.stdout, 0,4)
      process.stdout.write(`download ${downloaded} of ${total} \v`)
      await downloadVideo(agent, list[i], 'downloaded/')
      downloaded++
    }catch (e:any) {
      readline.cursorTo(process.stdout, 0, 12)
      console.error(e.message, "\v")
    }
  }
  // End Playlist download code
}
main()
