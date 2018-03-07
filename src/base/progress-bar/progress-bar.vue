<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- 已播放部分进度 亮色 -->
      <div class="progress" ref="progress"></div>
      <!-- 播放拖动按钮 -->
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <!-- 当前播放位置 按钮 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    // 创建1个共享对象 用于
    // progressTouchStart progressTouchMove以及
    // progressTouchEnd方法共享数据
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX
      // 已播放的宽度
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      // 本次拖动距离
      const deltaX = e.touches[0].pageX - this.touch.startX
      // 拖动后拖动按钮左侧高亮显示的部分 要满足两个条件
      // 1.>0  2.<整个进度条的宽度
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
    progressTouchEnd(e) {
      this.initiated = false
      // 拖动结束时派发1一个事件 调整歌曲播放时间与当前进度条一致
      this._triggerPercent()
    },
    // 根据传入的偏移量 从进度条左侧起设置宽度为偏移量大小的动画
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _triggerPercent() {
      // 进度条实际总宽度 = 进度条总宽度-播放拖动按钮的宽度
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 计算拖动结束后的进度百分比
      const percent = this.$refs.progress.clientWidth / barWidth
      // 派发事件 拖动完成 以便于让父组件接到该事件后根据percent值调整歌曲播放时刻
      this.$emit('percentChange', percent)
    },
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 进度条实际宽度 = 进度条总宽度-播放拖动按钮的宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 播放拖动按钮左侧宽度
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme

</style>