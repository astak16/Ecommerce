import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_transition.css'

import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import Swiper from 'components/Swiper.vue'
import url from 'js/api.js'
import mixin from 'js/mixin.js'

let { id } = qs.parse(location.search.substr(1))

let good = new Vue({
  el: '#app',
  data: {
    detailData: null,
    dealData: null,
    indexTab: 0,
    detailTab: ['商品详情', '本店成交'],
    bannerLists: null,
    skuIndex: 0,
    skuShow: false,
    skuNum: 1,
    cartShow: false,
    promptInfo: false
  },
  components: {
    Swiper
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      axios.get(url.detail, { id }).then(res => {
        this.detailData = res.data.data
        this.bannerLists = []
        this.bannerLists.push({
          clickUrl: '',
          img: this.detailData.imgs
        })
      })
    },
    changeTab (index) {
      this.indexTab = index
      if (index) {
        this.getDealLists()
      }
    },
    getDealLists () {
      axios(url.deal, { id }).then(res => {
        this.dealData = res.data.data.lists
      })
    },
    changeSku (index) {
      this.skuIndex = index
      this.skuShow = true
    },
    changeSkuNum (num) {
      if (num < 0 && this.skuNum === 1) return
      this.skuNum += num
    },
    addCart () {
      axios.post(url.add, {
        id,
        number: this.skuNum
      }).then(res => {
        if (res.status === 200) {
          this.skuShow = false
          this.cartShow = true
          this.promptInfo = true

          setTimeout(() => {
            this.promptInfo = false
          }, 1000)
        }
      })
    }
  },
  watch: {
    skuShow (newVal) {
      document.body.style.overflow = newVal ? 'hidden' : 'auto'
      document.querySelector('html').style.overflow = newVal ? 'hidden' : 'auto'
      document.body.style.height = newVal ? '100%' : 'auto'
      document.querySelector('html').style.height = newVal ? '100%' : 'auto'
    }
  },
  mixins: [mixin]
})
