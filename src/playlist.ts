import ytpl from '@distube/ytpl'

const playlistDL = async (url: string) => {
  const list = await ytpl(url)
  return list.items.map((item) => item.shortUrl)
}

export { playlistDL }