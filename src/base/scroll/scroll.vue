<template>
    <div ref="wrapper">
        <slot></slot>
    </div>    
</template>
<script type="text/ecmascrip-6">
import BScroll from 'better-scroll'

export default {
  props: {
      probeType: {
          type: Number,
          default: 1
      },
      click: {
          type: Boolean,
          default: true
      },
      data: {
          type: Array,
          default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
  },
  mounted () {
      setTimeout(() => {
          this._initScroll()
      },20)
  },
  methods: {
      _initScroll() {
          if(!this.$refs.wrapper) {
              return
          }
          this.scroll = new BScroll(this.$refs.wrapper, {
              probeType: this.probeType,
              click: this.click
          })
          // 如果要监听滑动事件 pos： {x,y}
          if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      enable() {
          this.scroll && this.scroll.enable()
      },
      disable() {
          this.scroll && this.scroll.disable()
      },
      //刷新scroll 重新计算高度
      refresh() {
          this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      } 
  },
  watch: {
    // 一旦数据发生了变化 则自动刷新列表
    data() {
        setTimeout(() => {
          this.refresh()
        },20)
    }  
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">

</style>

