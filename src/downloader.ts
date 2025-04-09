import ytdl, {Agent} from '@distube/ytdl-core'
import path from 'node:path'
import * as fs from "node:fs";
import ffmpeg from 'fluent-ffmpeg'
import * as readline from "node:readline";

const downloadVideo = async (agent: Agent, url: string, outputDir: string) => {
  return new Promise<void>( async (resolve, reject) => {
    try {
      const videoInfo = await ytdl.getInfo(url, {agent})
      const title = videoInfo.videoDetails.title.replace(/[<>:"/\\|?*]/g, '')
      const outputPath = path.join(outputDir, `${title}.mp4`)
      // console.log(videoInfo.formats)
      if (fs.existsSync(outputPath)) {
        readline.cursorTo(process.stdout, 0,5)
        console.log("Video Already Exists \v")
        return reject(new Error(`Video Already Exists ${title} \v`))
      }
      let format : ytdl.videoFormat

      try {
        // CHANGE QUALITY DOWNLOAD HERE
        format = ytdl.chooseFormat(videoInfo.formats, {quality: '135'})
      }catch (e:any) {
        readline.cursorTo(process.stdout, 0, 10)
        console.log(title," ",e.message, "\v")
        readline.cursorTo(process.stdout, 0, 11)

        // CHANGE DEFAULT QUALITY HERE IF SELECTED QUALITY NOT EXIST
        format = ytdl.chooseFormat(videoInfo.formats, {quality: 'highest'})
        if(!format.qualityLabel && !format.height)
          console.log("itag: ",format.itag, " selected \v")
        else if(!format.qualityLabel)
          console.log(format.height, " selected \v")
        else console.log(format.qualityLabel, " selected \v")
      }

      const video = ytdl(url, {agent, format})
      let downloadedVideo = 0

      video.on('data', (chunk) => {
        downloadedVideo += chunk.length;
        readline.cursorTo(process.stdout, 0,5)
        process.stdout.write(`\rDownload Video:  ${(downloadedVideo / 1024 / 1024).toFixed(2)} MB`);
      });

      if(!format.hasAudio){
        let downloadedAudio = 0
        const audio = ytdl(url, {agent, filter: "audioonly", quality: 'highest'})
        audio.on('data', (chunk) => {
          downloadedAudio += chunk.length;
          readline.cursorTo(process.stdout, 0,6)
          process.stdout.write(`\rDownload Audio:  ${(downloadedAudio / 1024 / 1024).toFixed(2)} MB`);
        });
        const audioLocation = "audiofile.mp3"
        const videoLocation = `videofile.mp4`
        audio.pipe(fs.createWriteStream(audioLocation));
        video.pipe(fs.createWriteStream(videoLocation));
        await Promise.all([
          new Promise((resolve, rejects)=> {
            audio.on("error", rejects).on("end", resolve)
          }),
          new Promise((resolve, rejects)=> {
            video.on("error", rejects).on("end", resolve)
          })
        ]);
        ffmpeg()
          .input(audioLocation)
          .input(videoLocation)
          .on('start', (command) =>{
            readline.cursorTo(process.stdout, 0,7)
            console.log(command, "\v")
          })
          .on('error', (err) => reject(err))
          .on("progress", (progress) => {
            readline.cursorTo(process.stdout, 0,8)
            process.stdout.write(progress.timemark+"\v")
          })
          .on('end', (code) => {
            readline.cursorTo(process.stdout, 0,9)
            console.log(`${title} saved. \v`)
            fs.unlinkSync(audioLocation);
            fs.unlinkSync(videoLocation);
            resolve()
          })
          .save(outputPath)
      }else {
        video.pipe(fs.createWriteStream(outputPath))
        video.on("error", (err) => {throw err})
        resolve()
      }

    }catch (e) {
      reject(e)
    }
  })
}

export {downloadVideo}
