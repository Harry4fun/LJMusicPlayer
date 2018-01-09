<template>
    <div class="singer">
      <!-- @select="selectSinger"  意为接受子组件元素被点击时发出的消息 @select = v-on="select" select
      关键词与子组件listview.vue中定义的@click方法名  <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">  保持一致
      -->
      <listview :data="singers" @select="selectSinger"></listview>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascrip-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
// 语法糖
import { mapMutations } from 'vuex'

const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'

export default{
created () {
    this._getSingerList()
},
data () {
    return {
        singers: []
    }
},
methods: {
    // 接受子组件传递过来的元素点击事件并处理
    selectSinger(singer) {
      console.log('selectSinger triggered...'+ singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 将当前点击选中的歌手信息存储到store
      this.setSinger(singer)
    },    
    ...mapMutations({
      setSinger:'SET_SINGER'
    }),
    _getSingerList() {
        getSingerList().then((res) => {
          if(res.code === ERR_OK){
            this.singers = this._normalizeSinger(res.data.list)
            console.log('歌手数据：',this.singers)
          }
        })
    },
    _normalizeSinger(list) {
        let map = {
            hot: {
                title:  HOT_NAME,
                items: []
            }
        }
        list.forEach((item,index) => {
            if(index < HOT_SINGER_LEN) {
              map.hot.items.push(new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name,
                singerId: item.Fsinger_id
              }))
            }
            const key = item.Findex
            if(!map[key]) {
              map[key] = {
                  title: key,
                  items: []
              }
            }
            map[key].items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
              singerId: item.Fsinger_id
            }))
        });
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)        
    }
},
    components: {
      Listview
    }

}

</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.singer
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
</style>