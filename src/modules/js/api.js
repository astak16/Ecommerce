let url = {
  hostLists: 'index/hotLists',
  banner: 'index/banner',
  topList: 'category/topList',
  subList: 'category/subList',
  rank: 'category/rank',
  searchList: 'search/list',
  detail: 'goods/details',
  deal: 'goods/deal',
  add: 'cart/add'
}

let host = 'http://rap2api.taobao.org/app/mock/7058/'
for (let key in url) {
  if (url.hasOwnProperty(key)) {
    url[key] = host + url[key]
  }
}
export default url
