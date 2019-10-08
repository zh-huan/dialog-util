import Vue from 'vue'
import Message from './components/dialog-base.vue'

export default {
  installDialog() {
    return {
      message: this.installMessage.bind(this),
      confirm: this.installConfirm.bind(this),
      subPop: this.installSubPop.bind(this),
    }
  },
  /*
  * 消息弹窗框
  * options={
  *    title:'',
  *    message:'',
  *    options:{
  *       detailMessage:'',
  *       iType:'1',//枚举值：1,2,3(警告类型图标，提示类型图标等，配合css使用)
  *       callbackMessageOK:func
  *    },
  * }
  * */
  installMessage(options) {
    options.dialogType = '0';
    options.initWidth = "400px";
    options.levelNum = 20;
    this.initBase(options);

  },
  /*
  * 确认弹窗框
  * options={
  *    title:"",
  *    message:"",
  *    options:{
  *       yesCallbackFunction:func,
  *       noCallbackFunction:func,
  *       yesText:'',
  *       noText:'',
  *       data:{}  //点击确认传给回调的数据
  *    },
  * }
  * */
  installConfirm(options) {
    options.dialogType = '1';
    options.initWidth = "400px";
    options.levelNum = 10;
    this.initBase(options);
  },
  /* 弹出框
  *  包含：子弹出窗（levelNum为0-9），通知框，确认框，加载中信息框
  *  参数：
  *  options={
  *      titleText：string，标题
  *      elemText：string，弹窗的html内容
  *      levelNum：int，Z轴上的层，分0-9层（可缺，默认值为0）
  *      initWidth: string（'400px'），初始化宽度（可缺）（此参数在手机浏览器上不生效，采用固定值：96%）
  *      initHeight: string，初始化高度（可缺）
  *      options：{
  *            minWidth: string，最小宽度，仅用于手机浏览器（可缺）
  *            minHeight: string，最小高度，仅用于手机浏览器（可缺）
  *            fullScreen：bool，是否显示全屏按钮（可缺）
  *            fullScreenCallback：func，点击全屏按钮的回调函数（可缺）
  *            closeCallback：func，点击窗口关闭事件的回调函数（可缺）
  *    }
  *  }
  */
  installSubPop(options) {
    options.dialogType = '2';
    options.levelNum = 0;
    this.initBase(options);
  },
  initBase(options) {
    var message = Vue.extend(Message)
    var component = new message({
      data: options
    }).$mount()
    document.querySelector('body').appendChild(component.$el)
  }
}
