<template>
  <scroll class="listview" 
  :data="data" ref="listview" 
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probeType="probeType"
  >
      <ul>
          <li v-for="group in data" class="list-group" ref="listGroup">
              <h2 class="list-group-title">{{ group.title }}</h2>
              <ul>
                  <li @click="selectItem(item)" class="list-group-item needsclick" v-for="item in group.items">
                      <img v-lazy="item.avatar" class="avatar"/>
                      <span class="name">{{ item.name }}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
          <ul>
              <li v-for="(item,index) in shortcutList" 
              class="item" 
              :data-index="index"
              :class="{'current': currentIndex === index }"
              >
                {{ item }}
              </li>
          </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
         <h1 class="fixed-title">{{ fixedTitle }}</h1> 
      </div>
      <div class="loading-container" v-if="!data.length">
        <loading></loading>
      </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'

const TITLE_HEIGHT = 30
// 每一行的高度
const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0, // 当前所在的分组index
      diff: -1 // 当前行高度的上限与 固定标题之间的高度差
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    // 创建
    shortcutList() {
      return this.data.map((group) => {
        console.log('shortcutList:' + group.title.substr(0, 1))
        return group.title.substr(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.shortcutList[this.currentIndex] ? this.shortcutList[this.currentIndex] : ''
    }
  },
  methods: {
    // 行点击事件
    selectItem(item) {
      // 发出信号 被点击的条目是什么
      this.$emit('select', item)
    },
    // 快速定位索引被点击时触发的事件
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      console.log('anchorIndex:' + e.target + anchorIndex)
      // 手指滑动开始的位置
      let firstTouch = e.touches[0]
      // https://developer.mozilla.org/en-US/docs/Web/API/Touch
      // Returns the X coordinate of the touch point relative to the left edge of the document.
      // Unlike clientX, this value includes the horizontal scroll offset, if any.
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    // 在索引上滑动时也能跳
    onShortcutTouchMove(e) {
    //   console.log('监听到滑动事件。。。')
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // 计算总滑动距离 滑动了几个格子
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 点击右侧导航栏时左侧列表跳转
    _scrollTo(index) {
      console.log('_scrollTo...' + index)
      // 点击导航栏顶部和底部的特殊处理
      if (!index && index !== 0) {
        return
      }
      // 滑动到导航栏顶部和底部的特殊处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 直接跳转到某一行时 也emit scroll事件 以便高亮右侧导航栏
      this.scrollY = -this.listHeight[index]

      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      console.log('当前列表中各行的高度数组', this.listHeight)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动你到顶部 newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动 此时newY是负值
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          console.log('height2', height2)
          console.log('newY', newY)
          console.log('this.currentIndex', this.currentIndex)
          console.log('this.diff:', this.diff)
          return
        }
      }
        // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
      console.log(this.currentIndex)
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal : 0
      // 以下几行代码主要是为性能优化考虑
      console.log('this.fixedTop', this.fixedTop)
      console.log('fixedTop', fixedTop)
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      //
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>