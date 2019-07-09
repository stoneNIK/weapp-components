/**
 * 仪表盘组件
 * 1. 默认为以刻度线的粗细来区分，每隔N个刻度一个粗刻度，每个刻度线宽度一样，宽的刻度为4px,细的为2px
 * 2. 当刻度线设置为均匀宽度时，表示以长短来区分间隔，每个刻度线宽度一样，均为1px，每隔N个刻度一个长刻度线,长的为10px，短的为5px
 * @params value {Number} 0-100百分比值,大于100显示100%
 * @params bgImg {String} 背景图的路径， hadBg为true时生效，默认为"/assets/images/dashboard.png"
 * @params stageEqually {Boolean} 刻度长度是否平均， 默认为true
 * @params stageInterval {Number} 刻度间隔， 默认为3， 表示每隔三个小刻度有一个大刻度
 * @params stageColor {Array} 刻度的颜色，第一项为激活刻度颜色，第二项为未激活刻度的颜色，默认['03FFEB', '#DADADA']
 * @params borderSpace {Number} 刻度距离外边距的宽度，默认mH/25
 */
let mW, mH, mCenter, mAngle, mRadius, ctx

Component({
  options: {

  },
  behaviors: [],
  properties: {
    value: {
      type: Number,
      value: 0
    },
    stageInterval: {
      type: Number,
      value: 3
    },
    stageEqually: {
      type: Boolean,
      value: true
    },
    borderSpace: {
      type: Number,
      value: 0
    },
    bgImg: {
      type: String,
      value: '/assets/images/dashboard.png'
    },
    stageColor: {
      type: Array,
      value: ['#03FFEB', '#DADADA']
    }
  },
  lifetimes: {
    attached() { 
      ctx = wx.createCanvasContext('canvas', this)
    }
  },
  observers: {
    'value': function(e) {
      this.initCanvas()
    }
  },
  ready: function(){
    this.initCanvas()
  },
  methods: {
    initCanvas() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.canvas').boundingClientRect(res => {
        if(!res){
          return
        }
        mW = res.width
        mH = res.height
        
        /**清空画布 */
        ctx.clearRect(0, 0, mW, mH)
        this.initOptions()
        this.drawWrap()
        this.drawStage()
      }).exec()
    },
    initOptions() {
      mRadius = mH/(1 - Math.cos(Math.PI*0.75)) // 半径以高度计算
      mCenter = {x: mW/2, y: mRadius }
      mAngle = Math.PI / 24 // 根据设计图,每个刻度为180/24 = 7.5度
    },
    drawWrap() {
      /**填充背景图 */
      if(this.data.bgImg) { 
        ctx.drawImage(this.data.bgImg, mCenter.x - mRadius, 0, mRadius*2, mH)
        ctx.draw(true)
      }

      // 画出轮廓
      // ctx.save()
      // ctx.beginPath()
      // ctx.lineWidth = 1
      // ctx.lineCap = 'round'
      // ctx.arc(mCenter.x, mCenter.y, mRadius, Math.PI*.75, Math.PI*.25, false)
      // ctx.stroke()
      // ctx.restore()
    },
    drawStage() {
      /**
       * Math.PI / 24
       * 角度从Math.PI * 3/4 到 Math.PI* 1/4顺时针
       * 7.5度有一个刻度,每隔n个刻度有一个大刻度,起始刻度为大刻度
       * 每个刻度距离外边距9px(设计图) 颜色:#DADADA, 激活刻度颜色:#03FFEB
       */
      let stageNum = ( Math.PI * 2 - Math.PI * 3/4 + Math.PI * 1/4 ) / (Math.PI / 24)
      let borderSpace = this.data.borderSpace || ( mH / 25 ) // 刻度距离外边框的距离
      let stageWidth = mH / 20 // 刻度的长度,根据高度计算， 或者通过外部传入
      let percent = this.data.value / 100 // 根据调用者传入的value值来计算
      let extraWidth = 0 // 刻度线矫正宽度，用于在stageEqually为false，即刻度线宽度均匀，绘制每个刻度线的起点
      /**
       * 每一个刻度绘制一次,性能不太好,待优化
       * TODO
       */
      for(let i=0; i<=stageNum;i++){
        
        ctx.beginPath()
        ctx.setStrokeStyle(this.data.stageColor[1] || '#FFF')
        if(i <= percent * stageNum) {
          ctx.setStrokeStyle(this.data.stageColor[0] || '#333')
        }
        /**
         * 默认为以刻度线的粗细来区分，每隔N个刻度一个粗刻度，每个刻度线宽度一样
         * 宽的刻度为4px,细的为2px
         */
        ctx.lineWidth = i % (this.data.stageInterval+1) === 0 ? 4 : 2
        /**
         * 当刻度线设置为均匀宽度时，表示以长短来区分间隔，每个刻度线宽度一样，均为1px
         * 每隔N个刻度一个长刻度线,长的为10px，短的为5px
         */
        if(!this.data.stageEqually){
          stageWidth = i % (this.data.stageInterval+1) === 0 ? mH/20 : mH/40
          ctx.setLineCap('round')
          ctx.lineWidth = 1
          extraWidth = i % (this.data.stageInterval+1) === 0 ? 0 : mH/40
        }
        let startX = mCenter.x + (mRadius-borderSpace - extraWidth) * Math.cos(mAngle * i + Math.PI*3/4)
        let startY = mCenter.y + (mRadius-borderSpace - extraWidth) * Math.sin(mAngle * i + Math.PI*3/4)
        let endX = mCenter.x + (mRadius-borderSpace-stageWidth - extraWidth) * Math.cos(mAngle * i + Math.PI*3/4)
        let endY = mCenter.y + (mRadius-borderSpace-stageWidth - extraWidth) * Math.sin(mAngle * i + Math.PI*3/4)
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
      ctx.restore()
      ctx.draw(true)
    }
  },
  externalClasses: ['hik-class']
})