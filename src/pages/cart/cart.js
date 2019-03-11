import 'css/common.css'
import './cart.css'
import './cart_base.css'
import './cart_trade.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'

let cart = new Vue({
  el: '.cart',
  data: {
    shopLists: null
  },
  methods: {
    getList () {
      axios.get(url.cartLists).then(res => {
        let shopLists = res.data.cartList
        shopLists.forEach(shop => {
          shop.goodsList.forEach(good => {
            good.checked = true
          })
        })
        this.shopLists = shopLists
      })
    },
    selectGood (goodItem) {
      goodItem.checked = !goodItem.checked
    }
  },
  computed: {
  },
  created () {
    this.getList()
  },
  mixins: [mixin]
})
