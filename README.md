## 列表渲染

![](https://i.loli.net/2019/03/07/5c80ad1648ef8.png)

通过`ajax`获取列表数据后，通过 Vue 提供的`v-for`将数据渲染在页面上。

### 滚动加载

使用`Mint-UI`实现滚动加载更多数据

文档地址：[Mint UI 基于 Vue.js 的移动端组件库](https://mint-ui.github.io/docs/#/en2/infinite-scroll)

**按需引入**

借助`babel-plugin-component`插件实现按需引入
```
yarn add babel-plugin-component -D
```
在`.babelrc`中修改下面配置：
```
{
  "presets": [
    ["es2015", { "modules": false }]
  ],
  "plugins": [["component", [
    {
      "libraryName": "mint-ui",
      "style": true
    }
  ]]]
}
```
在需要滚动加载的地方加入三个属性：`v-infinite-scroll="loadMore"`，`infinite-scroll-disabled="loading"`，`infinite-scroll-distance="10"`
```
<ul
  v-infinite-scroll="getLists"
  infinite-scroll-disabled="loading"
  infinite-scroll-distance="10">
  <li v-for="item in list">{{ item }}</li>
</ul>
```
`infinite-scroll-disabled`值为真时，则无限滚动不会被触发；`infinite-scroll-distance`值为触发加载方法的滚动距离阈值（像素)；`v-infinite-scroll`值为触发加载的方法。

```
data: {
    lists: null,
    pageNum: 1,
    pageSize: 6,
    loading: false,
    allLoaded: false,
}
```
`data`属性说明：
> `lists`：用来保存`ajax`返回的数据
> `pageNum`：要请求的第几页的内容
> `pageSize`：每页需要的数据
> `loading`：控制无限滚动是否被被触发，为 `true`时不会被触发
> `allLoaded`：是否加载到底部，为`true`时表示加载到底部了

`v-infinite-scroll`属性的方法，现在只是最基本的方式，每次滚动，都加载一次新数据，显然这不是我们需要的，我们需要的是不断的加载。

```
getLists () {
    axios.get(url.hostLists, {
    	pageNum: this.pageNum,
    	pageSize: this.pageSize
    }).then(res => {
    	this.lists = res.data.lists
    })
}
```

当第二次滚动时，获取到的数据应该是往`lists`里面添加，所以`getLsits`方法改为。

通过判定`lists`的真假，来判定是否有数据，如果`this.lists`为`false`则为第一次加载数据；之后`lists`都是有数据的，所以值就一直是`true`，通过数组提供的方法`concat`将老数据和新数据拼接起来。

```
getLists () {
    axios.get(url.hostLists, {
    	pageNum: this.pageNum,
    	pageSize: this.pageSize
    }).then(res => {
    	let curLists = res.data.lists
    	if (this.lists) {		//第一次 this.lists 值为 null，所以不会走这里
            this.lists = this.lists.concat(curLists)	// 第二次将新数据和原来的数据拼到一起
    	} else {				//第一次获取到数据后，将会走这条分支
            this.lists = curLists
    	}
    	this.pageNum++
    })
}
```

现在只要一滚动鼠标，就会发起请求，非常影响性能，使用`loading`进行节流，鼠标一滚动将`loading`设置为`false`，数据回来后，在将`loading`设置为`true`。
```
getLists () {
	this.lists = false
    axios.get(url.hostLists, {
    	pageNum: this.pageNum,
    	pageSize: this.pageSize
    }).then(res => {
    	let curLists = res.data.lists
    	if (this.lists) {		//第一次 this.lists 值为 null，所以不会走这里
            this.lists = this.lists.concat(curLists)	// 第二次将新数据和原来的数据拼到一起
    	} else {				//第一次获取到数据后，将会走这条分支
            this.lists = curLists
    	}
    	this.lists = true
    	this.pageNum++
    })
}
```

响应数据`curLists`的`length`如果小于`pageSize`说明，已经没有数据了，此时将`allLoaded`设置为`true`，表示数据已经到底了。
```
getLists () {
	if(this.allLoaded) return
	this.lists = false
    
    axios.get(url.hostLists, {
    	pageNum: this.pageNum,
    	pageSize: this.pageSize
    }).then(res => {
    	let curLists = res.data.lists
    
    	// 如果 curLists.length 小于 pageNum 说明没有数据了
    	if (curLists.length < this.pageNum) {
            this.allLoaded = true
    	}
    	
    	//第一次 this.lists 值为 null，所以不会走这里
    	if (this.lists) {
    		// 第二次将新数据和原来的数据拼到一起
            this.lists = this.lists.concat(curLists)
    	} else {
    		//第一次获取到数据后，将会走这条分支
            this.lists = curLists
    	}
    	this.lists = true
    	this.pageNum++
    })
}
```

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
