<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
        <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" :probe-type="probeType"
    :listen-scroll="listenScroll" @scroll="scroll"
    class="list" ref="list">
        <div class="song-list-wrapper">
          <!-- 注意 此处的selectItem由于是从子组件派发  没有加参数  -->
          <song-list @select="selectItem" :songs="songs"></song-list>          
        </div>
        <div class="loading-container" v-if="!songs.length">
          <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import {prefixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 歌曲列表当前的纵向位置
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // 计算歌曲列表的位置  把头像的高度闪出来
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back () {
      this.$router.back()
    },
    // 接受子组件被点击的事件通知 然后处理
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // vuex语法糖 作用是声明了 /store/actions.js 中的selectPlay方法
    /**    ...mapActions({
      selectPlay: 'selectPlay'
    })
    */
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      console.log(newY)
      let translateY = Math.max(this.minTransalteY, newY)
      let zIndex = 0

      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      // 头像高斯模糊效果
      let blur = 0
      // 实现歌曲列表向下拉动时歌手头像放大的动画效果
      let scale = 1
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }

      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.filter.style['backdrop'] = `blur(${blur}px)`
      if (newY < this.minTransalteY) {
        // 歌曲列表上拉到超过头像顶部的时候
        zIndex = 10
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.bgImage.style.paddingTop = 0
        // 播放按钮消失
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.height = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style['transform'] = `scale(${scale})`
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      // overflow hidden
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
