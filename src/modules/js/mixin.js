import Foot from 'components/Foot.vue'

let mixin = {
  components: {
    Foot
  },
  filters: {
    // 做小数判断不满两位，补全
    currency (price) {
      let priceStr = price + ''
      if (priceStr.indexOf('.') > -1) {
        let arr = priceStr.split('.')
        return arr[0] + '.' + (arr[1] + '0').substr(0, 2)
      } else {
        return price + '.00'
      }
    }
  }
}

export default mixin
