## 分类页面

分类页面中左侧导航在点击后需高亮显示，同时渲染其右侧分类页面

### 高亮

![](https://i.loli.net/2019/03/06/5c7f7d5b38765.png)

通过绑定`class`，通过判定`index`和`topIndex`值是否相等进行高亮显示
```vue
// index === topIndex 控制 active 显示
 <li class="category-name js-category-name" data-cid="list.id"
    :class="{active: index === topIndex}"
    v-for="(list, index) in topLists"
    :key="list.id"
    @click="getSubList(index, list.id)"
>
```
上面代码当我点击时左侧导航栏时，会触发`click`事件调用`getSubList`函数，并向这个函数中传递`index`、`id`，在函数内部接收到`index`之后，将`index`赋值给`topIndex`，同时回到上面代码，高亮就可以通过判定`index`和`topIndex`的值来确定了。高亮部分对应的分类页面，也可以通过`topIndex`来显示，
```vue
getSubList (index, id) {
  this.topIndex = index
  ...
}

v-if="topIndex === 0 && rankData"   // topIndex 等于 0 时，而且 rankData 有数据时，会被显示，同时隐藏另一个
v-if="topIndex > 0 && subData"      // topIndex 大于 0 时，而且 subData 有数据时，会被显示，同时隐藏另一个
```

### 价格处理

![](https://i.loli.net/2019/03/06/5c7f7dabb11dd.png)

在返回的数据中，价格的精确度不一样，需要在显示的时候统一处理下，使其有显示两位，如图所示。

Vue 为我们提供了一个`filters`的属性，它可以对某个值进行格式化处理，使其变成我们想要的格式。
```vue
<div class="price">￥{{item.price | addTwoDecimal}}</div>

filters: {
  addTwoDecimal (price) {                               // 做小数判断不满两位，补全
    let index = price.toString().indexOf('.') + 1       // 获取小数点的位置
    let digit = price.toString().length - index         // 小数位数 = 总长度 - 小数点的位置
    let newPrice
    if (digit === 0) {        // 等于 0 说明，有两位小数，等于 1 说明有 1 位小数，等于 2 说明没有小数
      newPrice = price
    } else if (digit === 1) {
      newPrice = price + '0'
    } else if (digit === 2) {
      newPrice = price + '.00'
    }
    return newPrice
  }
}
```

其原理为通过获取小数点的位置，然后用**数字的总长度减去小数点所在的位置**就能得到位数，接着在做判断时需要注意，**等于 0 说明，有两位小数，等于 1 说明有 1 位小数，等于 2 说明没有小数**
