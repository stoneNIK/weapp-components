/**
 * 车牌号码输入框（包含弹出层）
 * 使用方式：目前只支持函数式调用
 * 1.在页面JSON配置文件中配置组件的引入（usingComponents）："carnum-input": "/components/carnum-input/index"
 * 2.在模板中添加组件DOM：<carnum-input id="carnum-input" />
 *
 * 3.在页面初始化以后，获取到组件的DOM对象(onLoad)：
 * ```
 * CarNumInput = this.selectComponent('#carnum-input')
 * ```
 *
 * 4.在页面处理函数中添加调用代码：
 * ```
 * CarNumInput.init({
 *    plateNum: this.data.formData.plateNum
 * }).then(({ plateNum, callback }) => {
 *    // 输入成功回调
 *    拿到回调的plateNum进行处理，并手动调用callback()关闭弹窗
 *    callback && callback()
 * }).catch(({ plateNum }) => {
 *    // 取消输入
 *    console.log(plateNum)
 * })
 * ```
 * @param limitProvince {String} 限制省份列表, 不用间隔
 * @param limitCity {String} 限制城市列表， 不用间隔
 * @options initData {Object} 初始数据
 * 【备注：'_'开头的函数是内部函数】
 */

const ProvinceList = "京津沪渝晋蒙吉黑苏浙皖闽赣鲁豫鄂湘粤桂琼川云藏青宁新港澳台甘辽冀贵陕".split(
  ""
);
const NumberList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const LetterList = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const AdditionKeyList = "学挂警".split(""); // 可选中文字符（倒数第二位）

/** 标识输入框的位数
 * @param type {number} 键盘类型
 * 1：省份输入。键盘：省份简称。
 * 2：区号输入。键盘：数字+字母。数字和I不可选
 * 3：序号选择。键盘：数字+字母。I、O不可选
 * 4：特殊位数。键盘：数字+字母+特殊字符（'字'切换显示'学挂警'按钮）。I、O不可选
 * 5：新能源标识位。键盘：数字+字母。I、O不可选
 */
const InputAreaList = [
  { index: 0, type: 1 },
  { index: 1, type: 2 },
  { index: -1 }, // 分割点，例如：川A·12345
  { index: 2, type: 3 },
  { index: 3, type: 3 },
  { index: 4, type: 3 },
  { index: 5, type: 3 },
  { index: 6, type: 4 },
  { index: 7, type: 5 }
];

let IptCompleteFunc = null; // 完成 回调
let IptCancelFunc = null; // 取消 回调
Component({
  properties: {
    limitProvince: {
      type: String,
      value: ""
    },
    limitCity: {
      type: String,
      value: ""
    },
    checkKeyBoardMap: {
      type: Function
    }
  },
  data: {
    isShow: false,
    plateNum: "",
    canSubmit: false,
    showKeyboard: false,
    iptKeyList: [],
    activeIndex: -1, // 输入进程,不同的进程显示不同的键盘布局和功能.输入第一位字符为0，第二位字符为1
    inputAreaList: InputAreaList,
    additionKeyList: AdditionKeyList,
    showAdditionList: false
  },
  lifetimes: {
    attached() {}
  },
  observers: {
    activeIndex: function() {
      let { iptKeyList, showAdditionList } = this.getKeyBoardList();
      if (this.data.checkKeyBoardMap) {
        iptKeyList = this.data.checkKeyBoardMap(iptKeyList, this.data.plateNum, this.data.activeIndex);
      }
      this.setData({
        iptKeyList: iptKeyList,
        showAdditionList: !!showAdditionList
      });
    },
    plateNum: function() {
      const plateNum = this.data.plateNum;
      this.setData({
        canSubmit:
          !/\S+\s+\S+/.test(plateNum) &&
          plateNum.replace(/\s*/g, "").length >= 7
      });
    }
  },
  methods: {
    _show() {
      this.setData({
        isShow: true
      });
    },
    _close() {
      this.setData({
        isShow: false
      });
    },
    init: function(options) {
      let _plateNum = options.plateNum;
      // 目前只做前两位校验，如果不合法，置为空
      if (_plateNum[0] && this.checkProvinceDisabled(_plateNum[0])) {
        _plateNum = "";
      }
      if (_plateNum[1] && this.checkCityDisabled(_plateNum[1])) {
        _plateNum = _plateNum[0];
      }
      _plateNum = _plateNum.replace(/(\·|\s*)/g, "").toUpperCase();
      this.setData({
        plateNum: _plateNum,
        activeIndex: !_plateNum.length
          ? 0
          : _plateNum.length > 7
          ? 7
          : _plateNum.length === 7
          ? 6
          : _plateNum.length
      });
      this._show();
      return new Promise((resolve, reject) => {
        IptCompleteFunc = resolve;
        IptCancelFunc = reject;
      });
    },
    onClosePop() {
      IptCancelFunc &&
        IptCancelFunc({
          plateNum: this.data.plateNum
        });
      this._close();
    },
    confirm() {
      IptCompleteFunc &&
        IptCompleteFunc({
          plateNum: this.data.plateNum,
          callback: () => {
            this._close();
          }
        });
    },
    /**
     * 替换字符串中某个下标上字符的的内容
     * @param {string} str 被替换的字符串
     * @param {number} index 替换的下标
     * @param {string} key 替换的字符
     */
    replaceIndexChar(str, index, key) {
      return (
        str.slice(0, index) +
        (key !== undefined ? key : " ") +
        str.slice(index + 1)
      );
    },
    /** 删除按钮 */
    handleRemove() {
      const process = this.data.activeIndex;
      let plateNum = this.data.plateNum;
      // 如果位置上有值先删除
      if (plateNum[process] && plateNum[process] !== " ") {
        plateNum = this.replaceIndexChar(plateNum, process);
        this.setData({
          plateNum
        });
        return;
      }
      if (process === 7) {
        return;
      }
      //位置上没有值，光标回到上一个输入框，并删除上一个输入框的值
      const index = process - 1 > -1 ? process - 1 : 0;
      plateNum = this.replaceIndexChar(plateNum, index);
      this.setData({
        plateNum,
        activeIndex: index
      });
    },
    /** 用户输入 */
    handleInput({ currentTarget }) {
      const dataset = currentTarget.dataset;
      const key = dataset.key;

      if (dataset.disabled) {
        return;
      }

      // 输入第7位字符时（倒数第二位）,点击‘字’切换显示‘学挂警’字符按钮
      if (key === "字") {
        this.setData({
          showAdditionList: !this.data.showAdditionList
        });
        return;
      }

      const process = this.data.activeIndex;
      let plateNum = this.data.plateNum;
      plateNum = this.replaceIndexChar(plateNum, process, key);
      let activeIndex =
        process === 7
          ? 7
          : process + 1 > 6
          ? 6
          : plateNum[process + 1] && plateNum[process + 1] !== " "
          ? process
          : process + 1;
      this.setData({
        plateNum,
        activeIndex
      });
    },
    /** 选择输入框 */
    handleChooseIpt({ currentTarget }) {
      const dataset = currentTarget.dataset;
      const index = dataset.index;
      if (!this.data.plateNum[index - 1 > -1 ? index - 1 : 0]) {
        return;
      }
      this.setData({
        showKeyboard: true,
        activeIndex: Number(index)
      });
    },
    // 验证省份是否合法
    checkProvinceDisabled(str) {
      const keyboardList = ProvinceList;
      let limitProvince = this.data.limitProvince.split("");
      limitProvince = limitProvince.length > 0 ? limitProvince : keyboardList;
      return limitProvince.findIndex(i => i === str) === -1;
    },
    checkCityDisabled(str) {
      const keyboardList = NumberList.concat(LetterList);
      let limitCity = this.data.limitCity.split("");
      limitCity = limitCity.length > 0 ? limitCity : keyboardList;
      return (
        typeof str === "number" ||
        str === "I" ||
        limitCity.findIndex(i => i === str) === -1
      );
    },
    // 根据activeIndex的值（输入进程）来判断键盘的布局和按键禁用
    getKeyBoardList() {
      const process = this.data.activeIndex;
      if (process < 0) {
        return;
      }
      const keyboardType = InputAreaList.find(e => e.index === process).type;

      this.setData({
        showKeyboard: !!keyboardType
      });

      /** 第1位 省份选择 只有省份简称列表可选 */
      if (keyboardType === 1) {
        return {
          iptKeyList: ProvinceList.map(e => ({
            key: e,
            disabled: this.checkProvinceDisabled(e)
          }))
        };
      }

      /** 第2位 区号选择 英文字母+数字 数字和I不可选 */
      if (keyboardType === 2) {
        return {
          iptKeyList: NumberList.concat(LetterList).map(e => ({
            key: e,
            disabled: this.checkCityDisabled(e)
          }))
        };
      }

      /** 第3-6位 序号选择 英文字母+数字 I、O不可选 */
      if (keyboardType === 3) {
        return {
          iptKeyList: NumberList.concat(LetterList).map(e => ({
            key: e,
            disabled: e === "I" || e === "O"
          }))
        };
      }

      /** 第7位 序号选择 英文字母+数字+特殊字符切换（'学挂警'） I、O不可选 */
      if (keyboardType === 4) {
        let iptKeyList = NumberList.concat(LetterList);
        // 第三排最后一个字符插入'字',点击之后弹出'学挂警'三个可选字符按钮
        iptKeyList.splice(29, 0, "字");

        return {
          iptKeyList: iptKeyList.map(e => ({
            key: e,
            disabled: e === "I" || e === "O"
          })),
          showAdditionList: false
        };
      }

      /** 第8位 新能源车最后一位选择 英文字母+数字 I、O不可选 */
      if (keyboardType === 5) {
        return {
          iptKeyList: NumberList.concat(LetterList).map(e => ({
            key: e,
            disabled: e === "I" || e === "O"
          }))
        };
      }
    }
  }
});
