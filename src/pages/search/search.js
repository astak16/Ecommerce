import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import { InfiniteScroll } from 'mint-ui'
import qs from 'qs'
import Velocity from 'velocity-animate'

let {keyword, id} = qs.parse(location.search.substr(1))
Vue.use(InfiniteScroll)

new Vue({
  el: '.container',
  data: {
    searchList: null,
    isShow: false,
    allLoaded: false,
    loading_more: false,
    keyword,
    pageSize: 8,
    pageNum: 0
  },
  created () {
    this.getSearchList()
  },
  methods: {
    getSearchList () {
      if (this.allLoaded) return
      this.loading_more = true
      axios.get(url.searchList, {
        keyword,
        id,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }).then(res => {
        let curSearchList = res.data.lists

        if (curSearchList.length < this.pageSize) {
          this.allLoaded = true
        }

        if (this.searchList) {
          this.searchList = this.searchList.concat(curSearchList)
        } else {
          this.searchList = curSearchList
        }

        this.loading_more = false
        this.pageNum++
      })
    },
    move () {
      if (document.documentElement.scrollTop > 100) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    toTop () {
      Velocity(document.body, 'scroll', {duration: 1000})
    }
  },
  mixins: [mixin]
})
