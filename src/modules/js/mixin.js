import Foot from 'components/Foot.vue'

let mixin = {
  components: {
    Foot
  },
  filters: {
    // 做小数判断不满两位，补全
    currency (price) {
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
}

export default mixin
