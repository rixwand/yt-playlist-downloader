# How To Use
## Setup
After installing node dependency,
copy file sig.js in root to @node_modules/@distube/ytdl-core/lib

## Using Youtube cookie
- download browser extension [J2TEAM Cookies](https://chromewebstore.google.com/detail/j2team-cookies/okpidcojinmlaakglciglbpcpajaibco?hl=en-US&utm_source=ext_sidebar)
- Copy cookie as text
- paste in cookies.json at root folder

## Change Downloaded video quality
- you can find the reference [ itag here ](https://gist.github.com/sidneys/7095afe4da4ae58694d128b1034e01e2)
- Open src/downloader.ts
- change quality download at :
    ```js
    // CHANGE QUALITY DOWNLOAD HERE
    format = ytdl.chooseFormat(videoInfo.formats, {quality: '135'})
    ```
- set the default quality if selected quality not exist here :
  ```js
  // CHANGE DEFAULT QUALITY HERE IF SELECTED QUALITY NOT EXIST
  format = ytdl.chooseFormat(videoInfo.formats, {quality: 'highest'})
  ```
  ![Important](https://img.shields.io/badge/Warning-Attention?style=flat-square&color=yellow) use ``` highest ``` or ``` lowest ``` value for default quality to avoid error quality not found

## Start using
### download youtube video
- open index.ts
- activate code comment below to using youtube video download and disabled the code for playlist download 
  ```js
  await downloadVideo(agent, inputURL, 'downloaded/');
  ```
- run ```npm run start``` or ```yarn start```
- paste youtube video url and Enter
  
### playlist download
- open index.ts
- activate code comment below to using youtube playlist download and disabled the code for video download
  ```js
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
  ```
- run ```npm run start``` or ```yarn start```
- paste youtube playlist url and Enter
