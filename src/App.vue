<template>
  <div id="app">
    <button @click="message">消息弹窗</button>
    <button @click="confirm">确认弹窗</button>
    <button @click="subPop">子弹窗</button>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld'

  export default {
    name: 'App',
    methods: {
      message() {
        //消息弹窗
        let options = {
          title: "提示",
          message: "内容",
          options: {
            detailMessage: "detail",
            iType: "2",
            //callbackMessageOK:this.yesCallback.bind(this)
          }
        };
        this.$installdialog.message(options);
      },
      confirm() {
        //确认弹窗
        let options = {
          title: "提示",
          message: "确定是否？",
          options: {
            yesCallbackFunction: this.yesCallbackFunction,
            //  noCallbackFunction:this.noCallbackFunction,
            //  yesText:'',
            //   noText:'',
            data: {
              test: '111'
            }
          }
        }
        this.$installdialog.confirm(options);
      },
      yesCallbackFunction() {
        alert("点击了确定");
      },
      subPop() {
        let options = {
          title: "弹出",
          message: HelloWorld,
          initWidth: "300px",
          initHeight: "200px",
          options: {
            minWidth: "400px",
            minHeight: "300px",
            fullScreen: true,
            fullScreenCallback: this.fullScreenCallback,
            closeCallback: this.closeCallback,
          }

        }
        this.$installdialog.subPop(options);
      },
      fullScreenCallback() {
        console.log("最大化");
      },
      closeCallback() {
        console.log("关闭");
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
