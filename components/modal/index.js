/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
 *   <view>你自己需要展示的内容</view>
 * </modal>
 * 
 * 属性说明：
 * show： 控制modal显示与隐藏
 * height：modal的高度
 * bindcancel：点击取消按钮的回调函数
 * bindconfirm：点击确定按钮的回调函数
 */

let CurrentComponent = null

Component({
    properties: {
        //是否显示modal
        show: {
            type: Boolean,
            value: false
        },
        //modal的宽度
        width: {
            type: String,
            value: '90%'
        },
        //modal的高度
        height: {
            type: String,
            value: '80%'
        }
    },
    methods: {
        clickMask() {
            // this.setData({ show: false })
        },

        closeModal() {
            CurrentComponent.setData({ show: false })
        },

        cancel() {
            this.setData({ show: false })
            this.triggerEvent('cancel')
        },

        confirm() {
            // this.setData({ show: false })
            this.triggerEvent('confirm', { callback: this.closeModal })
        }
    },
    lifetimes: {
        attached: function () {
            CurrentComponent = this
        }
    }
})