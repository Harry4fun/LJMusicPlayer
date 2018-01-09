import * as types from './mutation-types'

// 声明mutation
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}
export default mutations