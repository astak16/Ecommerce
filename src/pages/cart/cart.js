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
    shopLists: null,
    total: 0,
    editingShop: null,
    editingShopIndex: -1
  },
  methods: {
    getList () {
      axios.get(url.cartLists).then(res => {
        let shopLists = res.data.cartList
        shopLists.forEach(shop => {
          shop.checked = true
          shop.removeChecked = false
          shop.editing = false
          shop.editingMsg = '编辑'
          shop.goodsList.forEach(good => {
            good.checked = true
            good.removeChecked = false
          })
        })
        this.shopLists = shopLists
      })
    },
    // 商品选择
    selectGood (shopItem, goodItem) {
      goodItem.checked = !goodItem.checked
      shopItem.checked = shopItem.goodsList.every(good => {
        return good.checked
      })
    },
    // 店铺选择
    selectShop (shopItem) {
      shopItem.checked = !shopItem.checked
      shopItem.goodsList.forEach(good => {
        // 点击店铺时，如果 shop 为 true，则 good 都为 true；
        // 点击店铺时，如果 shop 为 false，则 good 都为 false
        good.checked = shopItem.checked
      })
    },
    // 所有全选
    selectAll () {
      // 点击底部全选时，只需要判断店铺有没有被全选
      this.allSelect = !this.allSelect
    },
    edit (shopItem, shopIndex) {
      shopItem.editing = !shopItem.editing
      shopItem.editingMsg = shopItem.editing ? '完成' : '编辑'
      this.shopLists.forEach((shop, index) => {
        if (shopIndex !== index) {
          shop.editing = false
          shop.editingMsg = shopItem.editing ? '' : '编辑'
        }
      })
      this.editingShop = shopItem.editing ? shopItem : null
      this.editingShopIndex = shopItem.editing ? shopIndex : -1
    }
  },
  computed: {
    // 店铺全选
    allSelect: {
      // 读取店铺 checked 是否为 true，如果商品都为 true ，则店铺为 true
      get () {
        if (this.shopLists && this.shopLists.length) {
          return this.shopLists.every(shop => {
            return shop.checked
          })
        }
        return false
      },
      set (newVal) {
        // 点击底部全选时，allSelect 会变化，给店铺和商品设置这个 newVal
        this.shopLists.forEach(shop => {
          shop.checked = newVal
          shop.goodsList.forEach(good => {
            good.checked = newVal
          })
        })
      }
    },
    selectLists () {
      if (this.shopLists && this.shopLists.length) {
        // arr 是用来判断选中商品的个数
        let arr = []
        // total 总价
        let total = 0
        this.shopLists.forEach(shop => {
          shop.goodsList.forEach(good => {
            if (good.checked) {
              arr.push(good)
              total += good.price * good.number
            }
          })
        })
        this.total = total
        return arr
      }
      return []
    }
  },
  created () {
    this.getList()
  },
  mixins: [mixin]
})
