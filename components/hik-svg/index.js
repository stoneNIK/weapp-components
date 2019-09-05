/**
 * svg 图标 组件
 * 使用方式：<hik-svg name="warn" width="30rpx" height="30rpx" fill="#f30" />
 * 也可以在组件外部设置样式,但颜色(fill)————必须————通过传入
 * 如需添加图标则直接在less文件中添加项即可，className与调用时传入的name一致
 */
Component({
    options: {},
    behaviors: [],
    properties: {
        width: {
            type: String,
            value: '100%'
        },
        height: {
            type: String,
            value: '100%'
        },
        fill: {
            type: String,
            value: '#FFFFFF'
        },
        name: {
            type: String,
            value: ''
        }
    },
    data: {},
    lifetimes: {
        attached() {
            
        }
    },
    methods: {
    }
})