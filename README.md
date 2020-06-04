# 微信小程序（原生） 组件

## 雷达图组件 [radar] <font color="#f63" size="3">支持 canvas 转为 Image</font>

![demo_01](/demo/demo_01.png)
![demo_02](/demo/demo_02.png)

- @params
- list {Array} 数据 默认[], 数值请计算成百分比对应的 0-100 的整数值
  > [{value: 10, text: '文字', img: 'src_url', color: '#f39'}]
- bgColor {String} 多边形背景颜色
- noGrid {Boolean} 无网格 默认 false
- lineColor {String} 网格线的颜色 默认'#97D1FD'
- lineDash {Boolean} 是否是虚线网格 默认 true
- mSlot {Number} 网格层数 默认 4
- fillArea {Boolean} 数据区域是否填充颜色 默认 true
- fillColor {Array} 数据区域的颜色(或者线的颜色), 长度为 1 则为纯色,2 则为渐变(线性渐变) 默认['#5BEBFF', '#22B9FF']
- dataLineDash {Boolean} 数据连线是否为虚线(仅在 fillArea 为 false 的时候有效)
- pointsRadius {Number} 数据点的半径 默认为 0
- pointsColor {String} 数据点的颜色
- pointsDash {Boolean} 数据点是否为虚线 默认 false
- pointsFill {Boolean} 数据点是否为实心 默认 false
- background { String } 数据区域背景色，默认为空
- radiusPercent {String} 多边形的区域大小比例，默认为宽高最小边的 70%
- radarLinePattern {Array} 虚线多边形配置， 一组描述交替绘制线段和间距（坐标空间单位）长度的数字
- outlineBorder {Boolean} 是否显示最外层多边形线框， 默认为 false
- transformImage {Boolean} 是否将 canvas 转为 Image，因为小程序中 canvas 层级最高，导致很多显示问题。 默认为 true

## 仪表盘组件 [dashboard]

支持背景色和指针样式的仪表盘

## 自定义弹窗 [modal]

与原生弹窗和 vant-weapp 等 UI 库的弹窗不同，在点击确认按钮后触发事件，事件回调中关闭弹窗，用于特殊需求

## 动态颜色的svg图标 [color-svg]
```
<color-svg name="warn" width="30rpx" height="30rpx" fill="#f30" />
```
小程序不支持svg标签，这个组件可以设置svg的颜色，目前只有help、warn、edit三个图标，可以手动添加

## 空白区域占位符 [empty-block]

可用于全屏

## 行内loading [inline-loading]

行内loading

## 瀑布流布局 [waterfall-view]
item元素支持包含图片在内的所有内容

因为是移动端，两列瀑布流比较常用，目前只支持两列，如需扩展，原理同理。
```
<waterfall-view list="{{list}}" type="store" />
```