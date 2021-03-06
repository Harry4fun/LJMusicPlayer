// 定义歌手对象的set方法
export const singer = (state) => {
  return state.singer
}
// 定义歌曲的getter方法
export const playing = (state) => {
  return state.playing
}

export const fullScreen = (state) => {
  return state.fullScreen
}

export const playlist = (state) => {
  return state.playlist
}

export const sequenceList = (state) => {
  return state.sequenceList
}

export const mode = (state) => {
  return state.mode
}

export const currentIndex = (state) => {
  return state.currentIndex
}

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}