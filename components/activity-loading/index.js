/**
 * @param {Boolean} finished 是否加载完成
 * @param {String} color 主题色调 ，可以是渐变色(start,stop逗号分隔)
 */
Component({
  properties: {
    finished: {
      type: Boolean,
      value: false,
      observer: function (val) {
        if (val === true) {
          this.setData({
            percent: 100,
          });
        }
      },
    },
    color: {
      type: String,
      value: "#FF3500",
      observer: function (val) {
        let colors = [];
        if (val instanceof Array) {
          if (val.length > 1) {
            colors = val;
          } else {
            colors = [val[0], val[0]];
          }
        } else if (typeof val == "string" && val.indexOf(",") > -1) {
          colors = val.split(",");
        } else {
          colors = [val, val];
        }
        this.setData({
          colors,
        });
      },
    },
  },
  data: {
    colors: [],
    percent: 0,
  },
  lifetimes: {
    attached: function () {
      this.start();
    },
  },
  methods: {
    start() {
      this.setData({
        percent: 0,
      });
      var step = () => {
        const _val = this.data.percent + Math.floor(Math.random() * 10 + 1);
        this.setData({
          percent: _val > 100 ? 100 : _val,
        });
        if (_val < 100) {
          setTimeout(step, Math.random() * 500);
        }
      };
      step();
    },
  },
});
