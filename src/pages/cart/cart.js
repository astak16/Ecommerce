import 'css/common.css'
import './cart.css'
import './cart_base.css'
import './cart_trade.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'

let cart = new Vue({
  el: '.cart',
  data: {
    shopLists: null,
    total: 0,
    editingShop: null,
    editingShopIndex: -1,
    removeData: null,
    removePopup: false,
    removeMsg: ''
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
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      goodItem[attr] = !goodItem[attr]
      shopItem[attr] = shopItem.goodsList.every(good => {
        return good[attr]
      })
    },
    // 店铺选择
    selectShop (shopItem) {
      let attr = this.editingShop ? 'removeChecked' : 'checked'
      shopItem[attr] = !shopItem[attr]
      shopItem.goodsList.forEach(good => {
        // 点击店铺时，如果 shop 为 true，则 good 都为 true；
        // 点击店铺时，如果 shop 为 false，则 good 都为 false
        good[attr] = shopItem[attr]
      })
    },
    // 所有全选
    selectAll () {
      let attr = this.editingShop ? 'allRemoveSelect' : 'allSelect'

      // 点击底部全选时，只需要判断店铺有没有被全选
      this[attr] = !this[attr]
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
    },
    reduce (goodItem) {
      if (goodItem.number > 1) {
        axios.post(url.cartReduce, {
          id: goodItem.id
        }).then(res => {
          goodItem.number--
        })
      }
    },
    add (goodItem) {
      axios.post(url.cartAdd, {
        id: goodItem.id
      }).then(res => {
        goodItem.number++
      })
    },
    remove (shopItem, shopIndex, goodItem, goodIndex) {
      this.removeData = {shopItem, shopIndex, goodItem, goodIndex}
      this.removePopup = true
      this.removeMsg = '确定要删除商品吗？'
    },
    removeList () {
      this.removePopup = true
      this.removeMsg = `确定要删除${this.removeLists.length}个商品吗？`
    },
    removeConfirm () {
      if (this.removeMsg === '确定要删除商品吗') {
        let { shopItem, shopIndex, goodItem, goodIndex } = this.removeData
        axios.post(url.cartRemove, {
          id: goodItem.id
        }).then(res => {
          shopItem.goodsList.splice(goodIndex, 1)
          this.removePopup = false
          if (!shopItem.goodsList.length) {
            this.shopLists.splice(shopIndex, 1)
            this.resetShop()
          }
        })
      } else {
        let ids = []
        this.removeLists.forEach(good => {
          ids.push(good.id)
        })
        axios.post(url.cartMremove, { ids }).then(res => {
          let arr = []
          this.editingShop.goodsList.forEach(good => {
            let index = this.removeLists.findIndex(item => {
              return item.id === good.id
            })
            if (index === -1) {
              arr.push(good)
            }
          })
          if (arr.length) {
            this.editingShop.goodsList = arr
          } else {
            this.shopLists.splice(this.editingShopIndex, 1)
            this.resetShop()
          }
          this.removePopup = false
        })
      }
    },
    cancelConfirm () {
      this.removePopup = false
    },
    resetShop () {
      this.editingShop = null
      this.editingShopIndex = -1
      this.shopLists.forEach(shop => {
        shop.editing = false
        shop.editingMsg = '编辑'
      })
    },
    start (e, goodItem) {
      goodItem.startX = e.changedTouches[0].clientX
    },
    end (e, shopIndex, goodItem, goodIndex) {
      let endX = e.changedTouches[0].clientX
      let left = '0'
      if (goodItem.startX - endX > 100) {
        left = '-60px'
      }
      if (goodItem.startX - endX < 100) {
        left = '0px'
      }
      Velocity(this.$refs[`goods-${shopIndex}-${goodIndex}`], {
        left
      })
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
    allRemoveSelect: {
      get () {
        if (this.editingShop) {
          return this.editingShop.removeChecked
        }
        return false
      },
      set (newVal) {
        this.editingShop.removeChecked = newVal
        this.editingShop.goodsList.forEach(good => {
          good.removeChecked = newVal
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
    },
    removeLists () {
      if (this.editingShop) {
        let arr = []
        this.editingShop.goodsList.forEach(good => {
          if (good.removeChecked) {
            arr.push(good)
          }
        })
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
