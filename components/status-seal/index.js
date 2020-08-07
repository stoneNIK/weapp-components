/**
 * 调用方式：
 * JSON文件中定义组件："hik-status-seal": "/components/status-seal/index"
 * 页面中调用
 * <hik-status-seal width="100" status="1" text="审核中"></hik-status-seal>
 * 
 */

/**
 * 状态 图章
 * @param status {Number} 状态值，对应四种颜色，0：灰（invalid），1：蓝（info），2：黄（warn），3：红（danger）
 * @param width {Number} 图章宽度，高度和宽度一样 px
 * @param text {String} 图章文字
 */
Component({
    properties: {
        status: {
            type: Number,
            value: 1
        },
        width: {
            type: Number,
            value: 100
        },
        text: {
            type: String,
            value: '-'
        }
    },
    data: {
        types: ['invalid', 'info', 'warn', 'danger'],
        fontSize: 200
    },
    lifetimes: {
        attached: function () {
            const text = this.data.text || ''
            let wordsNum = text.replace(/\s*/g, "").length
            wordsNum = wordsNum < 4 ? 4 : wordsNum
            this.setData({
                fontSize: Number((800 / wordsNum).toFixed())
            })
        }
    }
})