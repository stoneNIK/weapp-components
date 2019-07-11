# weapp-radar
![demo_01](/demo/demo_01.png)

![demo_02](/demo/demo_02.png)

微信小程序（原生） 雷达图

* 雷达图组件
* @params
* list {Array} 数据 默认[], 数值请计算成百分比对应的0-100的整数值
```
[{value: 10, text: '文字', img: 'src_url', color: '#f39'}]
```
* noGrid {Boolean} 无网格 默认false
* lineColor {String} 网格线的颜色 默认'#97D1FD'
* lineDash {Boolean} 是否是虚线网格 默认true
* mSlot {Number} 网格层数 默认4
* fillArea {Boolean} 数据区域是否填充颜色 默认 true
* fillColor {Array} 数据区域的颜色(或者线的颜色), 长度为1则为纯色,2则为渐变(线性渐变) 默认```['#5BEBFF', '#22B9FF']```
* dataLineDash {Boolean} 数据连线是否为虚线(仅在fillArea为false的时候有效)
* pointsRadius {Number} 数据点的半径 默认为0
* pointsColor {String} 数据点的颜色 
* pointsDash {Boolean} 数据点是否为虚线 默认false
* pointsFill {Boolean} 数据点是否为实心 默认false
