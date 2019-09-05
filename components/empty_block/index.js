/**
 * 无数据 提示
 * @params type {String} 类型, 用于展示不同图标
 * content: 暂无内容
 * msg: 暂无消息
 * information:暂无信息
 * net: 网络有问题
 * fail: 加载失败
 * log: 暂无记录
 * @params desc {String} 描述
 * @params subDesc {String} 附加描述
 * @params fullPage {Boolean} 是否是全屏, 全屏的话顶部padding会大一些
 */

 const IconObj = {
  content: '/assets/images/empty_content.png',
  information:'/assets/images/img-zwxx.png',
  msg: '/assets/images/empty_msg.png',
  net: '/assets/images/empty_net.png',
  fail: '/assets/images/empty_fail.png',
  log: '/assets/images/empty_log.png',
  benefit: '/assets/images/empty_gyhd.png'
 }

Component({
  options: {

  },
  behaviors: [],
  properties: {
    type: {
      type: String,
      value: 'content'
    },
    desc: {
      type: String,
      value: ''
    },
    subDesc: {
      type: String,
      value: ''
    },
    fullPage: {
      type: Boolean,
      value: false
    }
  },
  data: {
    imgUrl: ''
  },
  lifetimes: {
    attached() { 
      this.setData({
        imgUrl: IconObj[this.data.type]
      })
    }
  },
  ready: function(){

  },
  methods: {

  }
})