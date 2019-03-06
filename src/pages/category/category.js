import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'

import Foot from 'components/Foot.vue'

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
    }
  },
  components: {
    Foot
  },
  filters: {
    // 做小数判断不满两位，补全
    addTwoDecimal (price) {
      // 获取小数点的位置
      let index = price.toString().indexOf('.') + 1
      // 小数位数 = 总长度 - 小数点的位置
      let digit = price.toString().length - index
      let newPrice
      // 等于 0 说明，有两位小数，等于 1 说明有 1 位小数，等于 2 说明没有小数
      if (digit === 0) {
        newPrice = price
      } else if (digit === 1) {
        newPrice = price + '0'
      } else if (digit === 2) {
        newPrice = price + '.00'
      }
      return newPrice
    }
  }
})
