import ytpl from '@distube/ytpl'
const playlistDL = async (url: string) => {
  const list = (await ytpl(url)).items as (ytpl.result["items"][number]&{shortUrl: string})[] 
  return list.map((item) => item.shortUrl)
}

export { playlistDL }