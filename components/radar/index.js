/**
 * 雷达图组件
 * @params
 * list {Array} 数据 默认[], 数值请计算成百分比对应的0-100的整数值
 * e.g [{value: 10, text: '文字', img: 'src_url', color: '#f39'}]
 * bgColor {String} 多边形背景颜色
 * noGrid {Boolean} 无网格 默认false
 * lineColor {String} 网格线的颜色 默认'#97D1FD'
 * lineDash {Boolean} 是否是虚线网格 默认true
 * mSlot {Number} 网格层数 默认4
 * fillArea {Boolean} 数据区域是否填充颜色 默认 true
 * fillColor {Array} 数据区域的颜色(或者线的颜色), 长度为1则为纯色,2则为渐变(线性渐变) 默认['#5BEBFF', '#22B9FF']
 * dataLineDash {Boolean} 数据连线是否为虚线(仅在fillArea为false的时候有效)
 * pointsRadius {Number} 数据点的半径 默认为0
 * pointsColor {String} 数据点的颜色 
 * pointsDash {Boolean} 数据点是否为虚线 默认false
 * pointsFill {Boolean} 数据点是否为实心 默认false
 * background { String } 数据区域背景色，默认为空
 * radiusPercent {String} 多边形的区域大小比例，默认为宽高最小边的70%
 * radarLinePattern {Array} 虚线多边形配置， 一组描述交替绘制线段和间距（坐标空间单位）长度的数字
 * outlineBorder {Boolean} 是否显示最外层多边形线框， 默认为false
 * transformImage {Boolean} 是否将canvas转为Image，因为小程序中canvas层级最高，导致很多显示问题。 默认为true
 */

/**
 * BUG
 * TODO: 不能绘制四边形,drawRegion时无法绘制出图形
 * bind:swipe 滑动事件 {direction: {x:(LEFT|RIGHT),y:(TOP|BOTTOM)}, distance:{x:0,y:0}}
 */
let mCount,  //元素个数 最多显示6个边
  mSlot, //一条线上的总节点数
  mW = 300,  //Canvas的宽度
  mH = 300,
  mAngle, //角度
  mCenterX,
  mCenter, //中心点
  mRadius, //半径(减去的值用于给绘制的文本留空间)
  ctx, //获取指定的Canvas
  areaList = [] // 绘制文字及图片时将坐标信息存储下来,用户点击之后将点击的区域信息传回

const canvasId = 'canvas'

let localRadarList = [] // 数据数组

Component({
  properties: {
    transformImage: {
      type: Boolean,
      value: true
    },
    radiusPercent: {
      type: String,
      value: 0.7
    },
    list: {
      type: Array,
      value: []
    },
    bgColor: {
      type: String,
      value: ''
    },
    lineColor: {
      type: String,
      value: '#97D1FD'
    },
    noGrid: {
      type: Boolean,
      value: false
    },
    lineDash: {
      type: Boolean,
      value: true
    },
    mSlot: {
      type: Number,
      value: 4
    },
    fillArea: {
      type: Boolean,
      value: true
    },
    fillColor: {
      type: Array,
      value: ['#5BEBFF', '#22B9FF']
    },
    dataLineDash: {
      type: Boolean,
      value: true
    },
    pointsRadius: {
      type: Number,
      value: 0
    },
    pointsColor: {
      type: String,
      value: '#fff'
    },
    pointsDash: {
      type: Boolean,
      value: false
    },
    pointsFill: {
      type: Boolean,
      value: false
    },
    background: {
      type: String,
      value: ''
    },
    radarLinePattern: {
      type: Array,
      value: [4, 2]
    },
    outlineBorder: {
      type: Boolean,
      value: false
    }
  },
  data: {
    tempImgPath: '', // 绘制完成后将画布内的内容导出成图片，得到的临时图片地址
  },
  methods: {
    // 初始化设置参数
    initSetting() {
      const len = localRadarList.length
      mCount = len > 6 ? 6 : len
      mSlot = this.data.mSlot
      mAngle = Math.PI * 2 / mCount
      mCenter = mH / 2
      mCenterX = mW / 2
      mRadius = mCenter * this.data.radiusPercent
    },
    drawBgColor() {
      ctx.save()
      let currR = mRadius
      ctx.setFillStyle(this.data.bgColor)
      ctx.beginPath()
      for (let j = 0; j < mCount; j++) {
        /**
         * 弧度减去Math.PI/2是为了将第一个点设置在时钟12点位置上,便于奇数点雷达图对称显示
         */
        let x = mCenterX + currR * Math.cos(mAngle * j - Math.PI / 2)
        let y = mCenter + currR * Math.sin(mAngle * j - Math.PI / 2)
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    },
    // 绘制多边形边
    drawPolygon() {
      ctx.save()
      let r = mRadius / mSlot
      ctx.setStrokeStyle(this.data.lineColor)
      if (this.data.lineDash) {
        ctx.setLineDash(this.data.radarLinePattern, 5)
      }
      //根据slot的数量画圈
      // 如果有背景色，则不绘制最外层的多边形连线
      const _mslot = this.data.outlineBorder ? mSlot : this.data.bgColor ? mSlot - 1 : mSlot
      for (let i = 0; i < _mslot; i++) {
        ctx.beginPath()
        let currR = r * (i + 1) //当前半径
        //画6条边
        for (let j = 0; j < mCount; j++) {
          /**
           * 弧度减去Math.PI/2是为了将第一个点设置在时钟12点位置上,便于奇数点雷达图对称显示
           */
          let x = mCenterX + currR * Math.cos(mAngle * j - Math.PI / 2)
          let y = mCenter + currR * Math.sin(mAngle * j - Math.PI / 2)
          ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
    },
    // 顶点连线
    drawLines() {
      ctx.save()
      ctx.beginPath()
      ctx.setStrokeStyle(this.data.lineColor)
      if (this.data.lineDash) {
        ctx.setLineDash(this.data.radarLinePattern, 5)
      }
      for (let i = 0; i < mCount; i++) {
        let x = mCenterX + mRadius * Math.cos(mAngle * i - Math.PI / 2)
        let y = mCenter + mRadius * Math.sin(mAngle * i - Math.PI / 2)
        ctx.moveTo(mCenterX, mCenter)
        ctx.lineTo(x, y)
      }
      /**
       * 此处不能使用闭合路径,因为起始点是中心点,终点是在圆弧上,若闭合后则会有一条实线连接起点和终点
       */
      // ctx.closePath()
      // ctx.setStrokeStyle(this.data.lineColor)
      ctx.stroke()
      ctx.restore()
    },
    // 绘制文字
    drawText() {
      ctx.save()
      let mData = localRadarList
      for (let i = 0; i < mCount; i++) {
        let fontSize = mData[i].fontSize || mCenter / 12
        ctx.setFontSize(fontSize)
        let imgWidth = mData[i].img ? 20 : 0
        let x = mCenterX + mRadius * Math.cos(mAngle * i - Math.PI / 2) * 1.1
        let y = mCenter + mRadius * Math.sin(mAngle * i - Math.PI / 2) * 1.1
        ctx.setFillStyle(mData[i].color || '#7B7A7A')
        /**
         * 根据角度设置向哪个方向位移,确保文字及图片在多边形外 
         * */
        if (mAngle * i >= -Math.PI / 2 && mAngle * i <= 0) {
          x -= ctx.measureText(mData[i].text).width / 2
        }

        if (mAngle * i > 0 && mAngle * i <= Math.PI / 2) {
          // y -= fontSize
        }

        if (mAngle * i > Math.PI / 2 && mAngle * i < Math.PI) {
          y += fontSize
        }

        if (mAngle * i == Math.PI) {
          x -= ctx.measureText(mData[i].text).width / 2
          y += fontSize
          /**
           * 如果在6点钟方向,并且有图片,还需加上图片的高度
           */
          if (mData[i].img) {
            y += imgWidth
          }
        }

        if (mAngle * i > Math.PI && mAngle * i <= Math.PI * 1.5) {
          x -= ctx.measureText(mData[i].text).width
          y += fontSize
        }

        if (mAngle * i > Math.PI * 1.5 && mAngle * i <= Math.PI * 2) {
          x -= ctx.measureText(mData[i].text).width
        }

        ctx.fillText(mData[i].text, x, y)

        /**
         * 存储坐标信息,用户点击时计算落点区域
         * 坐标向四周扩展2个像素,便于计算手指点击时落点
         */
        areaList[i] = {
          x: x - 2,
          y: y - fontSize,
          width: ctx.measureText(mData[i].text).width + 4,
          height: fontSize + 4,
          data: mData[i]
        }

        /**
         * 绘制图片
         */
        if (mData[i].img) {
          ctx.drawImage(
            mData[i].img,
            x + (ctx.measureText(mData[i].text).width - imgWidth) / 2,
            y - imgWidth - fontSize - 2,
            imgWidth,
            imgWidth
          )

          areaList[i] = {
            x: x - 2,
            y: y - fontSize - imgWidth - 4,
            width: ctx.measureText(mData[i].text).width + 4,
            height: fontSize + imgWidth + 4,
            data: mData[i]
          }
        }
      }
      ctx.restore()
    },
    //绘制数据区域
    drawRegion() {
      ctx.save()
      let mData = localRadarList
      ctx.beginPath()

      for (let i = 0; i < mCount; i++) {
        const value = Math.min(mData[i].value, 100)
        let x = mCenterX + mRadius * Math.cos(mAngle * i - Math.PI / 2) * value / 100
        let y = mCenter + mRadius * Math.sin(mAngle * i - Math.PI / 2) * value / 100
        ctx.lineTo(x, y)
      }
      ctx.closePath()

      // 指定颜色是渐变还是纯色
      const fillColors = this.data.fillColor
      let grd = fillColors[0]

      if (fillColors.length > 1) {
        // 取了一个大概值,后期可根据情况调整
        let x1 = mCenter + mRadius * Math.cos(mAngle * mSlot)
        let y1 = mCenter + mRadius * Math.sin(mAngle * mSlot)
        let x2 = mCenter + mRadius * Math.cos(0)
        let y2 = mCenter + mRadius * Math.sin(0)
        grd = ctx.createLinearGradient(x1, y1, x2, y2)
        grd.addColorStop(0, fillColors[0])
        grd.addColorStop(1, fillColors[1])
      }

      if (this.data.fillArea) { // 填充数据区域为实心
        ctx.setFillStyle(grd)
        ctx.fill()
      } else {
        ctx.setStrokeStyle(grd)
        /**
         * 绘制为实线或者虚线
         */
        if (!this.data.dataLineDash) {
          ctx.setLineDash([5, 5], 20)
        } else {
          ctx.setLineDash([0, 0], 0)
        }
        ctx.stroke()
      }
      ctx.restore()
    },
    drawCircle() {
      ctx.save()
      let mData = localRadarList
      for (let i = 0; i < mCount; i++) {
        /**
         * 绘制点的时候往中心收一点,刚好包含在多边形内
         */
        let x = mCenterX + mRadius * Math.cos(mAngle * i - Math.PI / 2) * (mData[i].value - this.data.pointsRadius) / 100
        let y = mCenter + mRadius * Math.sin(mAngle * i - Math.PI / 2) * (mData[i].value - this.data.pointsRadius) / 100
        ctx.beginPath()
        ctx.arc(x, y, this.data.pointsRadius, 0, Math.PI * 2)
        if (!this.data.pointsDash) {
          ctx.setLineDash([0, 0], 0)
        } else {
          ctx.setLineDash([2, 2], 5)
        }
        /**
         * 是否实心填充
         */
        if (!this.data.pointsFill) {
          ctx.setStrokeStyle(this.data.pointsColor)
          ctx.stroke()
          ctx.beginPath()
          ctx.setFillStyle('#fff')
          ctx.arc(x, y, this.data.pointsRadius - 1, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.setFillStyle(this.data.pointsColor)
          ctx.fill()
        }
      }
      ctx.restore()
    },
    onTap(e) {
      let touch0 = e.touches && e.touches[0]
      if (touch0) {
        // 判断落点位置,并触发调用页面的回调事件
        let clickArea = areaList.find((item) => {
          /**
           * 在落点范围内,即为点击的是该元素
           */
          if (touch0.x >= item.x && touch0.x <= item.x + item.width && touch0.y >= item.y && touch0.y <= item.y + item.height) {
            return true
          }
          return false
        })
        this.triggerEvent('click', clickArea || touch0)
      }
    },
    downloadFile(item) {
      return new Promise((resolve, reject) => {
        if (!item.img) {
          resolve(item)
          return
        }
        wx.getImageInfo({
          src: item.img,
          success(res) {
            const _item = item
            _item.img = res.path
            resolve(item)
          },
          fail() {
            reject(item)
          }
        })
      })
    },
    /**
     * 开始绘制canvas
     */
    initCanvas() {
      if (!(localRadarList.length)) {
        return
      }
      this.setData({
        tempImgPath: ''
      })
      const promise = this.getBoundingClientRect()
      promise.then(res => {
        /**
         * 根据画布尺寸计算中心点, 宽度, 半径等
         */
        mW = res.width
        mH = res.height
        this.initSetting()
        this.clearCanvas()
        // 如果有背景色，则绘制一个多边形背景色
        if (this.data.bgColor) {
          this.drawBgColor()
        }
        /**
         * 无网格样式时则不需要绘制
         */
        if (!this.data.noGrid) {
          this.drawPolygon()
          this.drawLines()
        }

        this.drawText()
        this.drawRegion()
        /**
         * 不需要标注数据点时,则不绘制
         */
        if (this.data.pointsRadius) {
          this.drawCircle()
        }
        /**
         * 将之前每一次的路径存储起来，最后执行draw.避免最后一次绘制覆盖之前的路径
         */
        ctx.draw(false, () => {
          if (!(this.data.transformImage && !this.data.tempImgPath)) {
            return
          }
          const that = this
          setTimeout(() => {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: mW,
              height: mH,
              canvasId: canvasId,
              success: function (res) {
                that.setData({
                  tempImgPath: res.tempFilePath
                })
              },
              fail(e) {
                console.log(e)
              }
            }, this)
          }, 100)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    // BUG：小程序 drawImage 不允许使用外网图片地址
    // 开始绘制之前序列化数据，将外网的icon下载到本地
    preInitCanvas() {
      this.showErrMsg('加载中...')
      const downloadFile = this.downloadFile
      const promises = localRadarList.map(s => downloadFile(s))
      Promise.all(promises).then(res => {
        localRadarList = res
        this.initCanvas()
      }).catch(e => {
        this.showErrMsg(e)
      })
    },
    /**
     * showErrMsg
     * @param {String} errMsg 提示文字
     * @param {Boolean} danger 是否为‘错误’，错误则显示红色文字
     */
    showErrMsg(errMsg, danger) {
      const promise = this.getBoundingClientRect()
      promise.then(res => {
        mW = res.width
        mH = res.height
        // 绘制文本
        ctx.setFontSize(10)
        ctx.setFillStyle(danger ? '#ff3300' : '#ffffff')
        const metrics = ctx.measureText(errMsg)
        ctx.fillText(errMsg, (mW - metrics.width) / 2, mH / 2, mW)
        ctx.draw(true)
      }).catch(e => { /* console.log(e) */ })
    },
    clearCanvas() {
      ctx.clearRect(0, 0, mW, mH)
      this.setData({ imagePath: '' })
    },
    // 获取当前画布的尺寸
    getBoundingClientRect() {
      const query = wx.createSelectorQuery().in(this)
      return new Promise((resolve, reject) => {
        query.select('.canvas').boundingClientRect(res => {
          if (!res) {
            reject()
            return
          }
          // 执行回调
          resolve(res)
        }).exec()
      })
    }
  },
  canvasIdErrorCallback(e) {
    this.showErrMsg('canvas发生错误: ' + e.detail.errMsg, 1)
  },
  observers: {
    'list': function (e) {
      localRadarList = this.data.list
      this.preInitCanvas()
    }
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      ctx = wx.createCanvasContext(canvasId, this)
    }
  },
  externalClasses: ['hik-class']
})