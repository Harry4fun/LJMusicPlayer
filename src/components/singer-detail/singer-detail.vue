<template>
<transition class="slide">
  <div class="singer-detail">gfdgdfgdfg
  </div>
</transition>

</template>
<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data () {
    return {
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    console.log('this.singer:', this.singer)
    this._getDetail()
  },
  methods: {
    // 根据歌手id 获取歌手歌曲详情
    _getDetail() {
      // 如果传过来的歌手id为空 则跳回到歌手列表
      // 此处的this.singer 是this.$store.getters.singer
      if (!this.singer.id) {
        this.$router.push({
          path: '/singer'
        })
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
          console.log('处理过后的歌手详情数据>>>>>', this.songs)
        }
      })
    },
    // 歌手详情数据处理
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        // es6的解构赋值。大括号中的key对应item的key  其值也是相对应的
        // 相当于 let musicData = item.musicData
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus"> 
@import "~common/stylus/variable"

.singer-detail
  position: fixed
  z-index: 100
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $color-background

.slide-enter-active, .slide-leave-active
  transition: all 0.3s

.slide-enter, .slide-leave-to
  transform: translate3d(100%, 0, 0)  
</style>