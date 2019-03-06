import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'

new Vue({
  el: '#app',
  data: {
    topLists: null,
    // 用来判定是否和 index 相等，从而控制对应分类显示
    topIndex: 0,
    subData: null,
    rankData: null
  },
  created () {
    this.getTopList()
    this.getSubList(0)
  },
  methods: {
    getTopList () {
      axios.get(url.topList).then(res => {
        this.topLists = res.data.lists
      })
    },
    getSubList (index, id) {
      this.topIndex = index
      if (index === 0) {
        this.getRank()
      } else {
        axios.get(url.subList, { id }).then(res => {
          this.subData = res.data.data
        })
      }
    },
    getRank () {
      axios.get(url.rank).then(res => {
        this.rankData = res.data.data
      })
    },
    toSearch (item) {
      location.href = `search.html?keyword=${item.name}&id=${item.id}`
    }
  },
  mixins: [mixin]
})
