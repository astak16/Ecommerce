import 'css/common.css'
import './index.css'
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import { InfiniteScroll } from 'mint-ui'
import Foot from 'components/Foot.vue'
Vue.use(InfiniteScroll)

let app = new Vue({
  el: '#app',
  data: {
    lists: null,
    pageNum: 1,
    pageSize: 6,
    // infinite-scroll-disabled 值为false 表示可以继续加载，true 表示不可以继续加载
    loading: false,
    allLoaded: false
  },
  components: {
    Foot
  },
  created () {
    this.getLists()
  },
  methods: {
    getLists () {
      if (this.allLoaded) return
      this.loading = true
      axios.get(url.hostLists, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        let curLists = res.data.lists

        // 判断所有数据是否加载完毕
        if (curLists.length < this.pageSize) {
          this.allLoaded = true
        }
        if (this.lists) {
          this.lists = this.lists.concat(curLists)
        } else {
          // 第一次请求数据
          this.lists = curLists
        }
        this.loading = false
        this.pageNum++
      })
    }
  }
})
