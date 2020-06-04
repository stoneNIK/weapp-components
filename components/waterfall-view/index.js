Component({
  behaviors: [],
  properties: {
    list: {
      //数据初始的列表
      type: Array,
      value: [],
    },
    type: {
      // 类型。首页推荐: store
      type: String,
      value: "",
    },
  },
  data: {
    // 渲染的列表，通过遍历循环渲染每一项
    leftList: [],
    rightList: [],
  },
  methods: {
    renderView() {
      this.setData({
        leftList: [],
        rightList: [],
      });
      setTimeout(() => {
        this.renderItem();
      });
    },
    async renderItem(index = 0) {
      const dataList = this.data.list;
      const leftList = this.data.leftList;
      const rightList = this.data.rightList;
      const leftHeight = await this.getLeftHeight();
      const rightHeight = await this.getRightHeight();
      if (leftHeight <= rightHeight) {
        leftList.push(dataList[index]);
      } else {
        rightList.push(dataList[index]);
      }
      this.setData({
        leftList,
        rightList,
      });
      if (index + 1 < dataList.length) {
        this.renderItem(index + 1);
      }
    },
    async getLeftHeight() {
      return await this.getRectHeight("#left-waterfall");
    },
    async getRightHeight() {
      return await this.getRectHeight("#right-waterfall");
    },
    getRectHeight(selector) {
      var query = wx.createSelectorQuery().in(this);
      return new Promise((resolve, reject) => {
        query
          .select(selector)
          .boundingClientRect(function (rect) {
            resolve(rect.height);
          })
          .exec();
      });
    },
    navigate({ currentTarget }) {
      const path = currentTarget.dataset.path;
      getApp().navigateTo(path);
    },
  },
  observers: {
    list: function (val) {
      if (val && val.length) {
        this.renderView();
      }
    },
  },
});
