const app = getApp()
Component({
  properties: {
    // 是否专网上传
    pvtUpload: {
      type: Boolean,
      value: false
    },
    // 默认图片列表
    imgs: {
      type: Array,
      value: []
    },
    // 是否可以预览
    canPreview: {
      type: Boolean,
      value: true
    },
    // 是否显示默认Icon 不显示则需要手动配置
    showIcon:{
      type: Boolean,
      value: true
    },
    // 显示上传按钮
    showUpload: {
      type: Boolean,
      value: true
    },
    // 允许上传的最大张数
    maxSize: {
      type: Number,
      value: 1
    },
    // 能否移除文件
    canRemove: {
      type: Boolean,
      value: true
    },
    // 使用大图
    bigImage:{
      type: Boolean,
      value: false
    },
    //其他背景图
    backImg:{
      type: String,
      value: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 上传按钮样式
    upBtnStyle: {
      type: String,
      value: ''
    },
    // 必须使用拍照
    mustTakePhoto: {
      type: Boolean,
      value: false
    },
    //图片下方显示文字
    showText: {
      type: String,
      value: ''
    }
  },
  data: {
    images: [],
    uploading: false
  },
  lifetimes: {
    attached() { 
      this.updateImgs()
    }
  },
  observers: {
    'imgs': function(e) {
      this.updateImgs()
    }
  },
  ready(){
    this.updateImgs()
  },
  methods: {
    getRelativePath(s) {
      s = s.replace('http://', '').replace('https://', '')
      s = s.substring(s.indexOf('/'))
      return s
    },
    updateImgs() {
      this.setData({
        images: (this.data.imgs || []).map(s => {
          if (typeof s === 'string') {
            return {
              fullUrl: s,
              url: this.getRelativePath(s)
            }
          }
          return s
        })
      })
    },
    // 选择图片
    chooseImage() {
      const _this = this
      if (this.data.uploading || this.data.disabled) return
      if (this.data.maxSize - this.data.images.length <= 0) {
        return
      }
      this.setData({
        uploading: false
      })
      let sourceType = ['album', 'camera']
      if (this.data.mustTakePhoto) {
        sourceType = ['camera']
      }
      wx.chooseImage({
        count: _this.data.maxSize - _this.data.images.length,
        sourceType,
        sizeType: ['compressed'],
        success(res) {
          const uploadFile = _this.data.pvtUpload ? app.API.common.uploadPvtFile : app.API.common.uploadFile
          const promises = res.tempFilePaths.map(s => uploadFile(s))
          wx.showLoading({
            title: '文件上传中'
          })
          Promise.all(promises).then(res => {
            let imgs = _this.data.images
            imgs = imgs.concat(res)
            _this.setData({
              images: imgs,
              uploading: false
            })
            _this.triggerEvent('change', imgs)
            wx.hideLoading()
          }).catch(e => {
            wx.hideLoading()
            _this.setData({
              uploading: false
            })
          })
        },
        fail(e) {
          if (e.errMsg.indexOf('cancel') <= 0) {
            const msg = e.errMsg
            wx.showToast({
              title: msg,
              icon: 'none'
            })
          }
          _this.setData({
            uploading: false
          })
        }
      })
    },
    // 移除上传的文件
    removeImgItem(e) {
      if (!this.data.canPreview) return
      const index = e.currentTarget.dataset.dindex
      if (this.data.images.length > index) {
        const imgs = this.data.images
        imgs.splice(index, 1)
        this.setData({
          images: imgs
        })
        this.triggerEvent('change', imgs)
      }
    },
    //点击预览图片
    seeImage(event){
      const imgurl = event.currentTarget.dataset.imgurl
      wx.previewImage({
        current: imgurl,
        urls: this.data.images.map(s => (typeof s === 'string') ? s : s.fullUrl)
      })
    }
  },
  externalClasses: ['custom-class']
})
