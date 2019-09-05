const app = getApp()

Component({
    properties: {
        list: {
            type: Array,
            value: []
        },
        loading: {
            type: Boolean,
            value: false
        },
        itemSplit: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        async linkDetail({ currentTarget }) {
            const dataset = currentTarget.dataset
            const msgItem = this.data.list.find(item => item.msgId === dataset.msgid)
            try {
                !msgItem.read && await app.API.article.readMsg({ msgId: dataset.msgid })
                this.triggerEvent('onReadMsg', { msgId: dataset.msgid, index: dataset.index })
            } catch (error) {
                wx.showToast({
                    title: '操作失败'
                })
            }
        },
        onDeleteByLongPress({ currentTarget }) {
            const that = this
            const dataset = currentTarget.dataset
            wx.showModal({
                title: '提示',
                content: '确认删除？',
                success(res) {
                    if (res.confirm) {
                        that.triggerEvent('onRemoveMsg', { msgId: dataset.msgid, index: dataset.index })
                    }
                }
            })
        }
    }
})