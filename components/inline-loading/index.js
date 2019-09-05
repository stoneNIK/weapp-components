Component({
    properties: {
        spinner: {
            type: Boolean,
            value: false
        },
        // 字体大小，单位rpx
        fontSize: {
            type: Number,
            value: 20
        },
        // 字体颜色
        color: {
            type: String,
            value: '#c9c9c9'
        },
        // 字体提示
        text: {
            type: String,
            value: '加载中...'
        }
    },
    data: {},
    methods: {},
    ready: function(){
        
    }
})