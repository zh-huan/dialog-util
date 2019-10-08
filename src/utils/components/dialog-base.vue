<template>
  <div class="dialog-pop" v-bind:data-level="levelNum" v-bind:style="'z-index:'+zIndex" v-bind:ref="'dialog-'+levelNum">
    <div class="dialog-pop-bg"></div>
    <div v-bind:class="'dialog-pop-panel '+umMoveClass"
         v-bind:style="{width:initWidth,height:initHeight,top:top+'px',left:left+'px','min-height':minHeight,'min-width':minWidth}">
      <div class="dialog-pop-panelmain">
        <div class="dialog-pop-top">
          <span class="dialog-pop-title">{{title}}</span>
          <button class="iconfont icon-guanbidanchuchuangkou dialog-pop-icon dialog-pop-close" type="button" v-on:click.stop="closedialog"></button>
          <button class="iconfont icon-danchuchuang dialog-pop-icon dialog-pop-full" type="button" v-on:click.stop="fullScreenCallback" v-if="fullScreen"></button>
          <div v-drag="greet"
               v-bind:style="{height: '100%',position: 'absolute',top:0,left: 0,right:(fullScreen?'60':'30')+'px'}"></div>
        </div>
        <div class="dialog-pop-body">
          <dialog-message v-if="dialogType=='0'" v-bind:options="options" v-bind:message="message"></dialog-message>
          <dialog-confirm v-if="dialogType=='1'" v-bind:options="options" v-bind:message="message"></dialog-confirm>
          <component :is="message" v-if="dialogType=='2'"></component>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import message from './dialog-message.vue';
  import confirm from './dialog-confirms.vue';
  import '../../assets/font/iconfont.css'
  Vue.directive('drag',//弹出框拖动指令
    {
      bind: function (el, binding) {
        let oDiv = el;   //当前元素
        oDiv.onmousedown = function (e) {
          let parent = e.target.parentNode.parentNode.parentNode;
          //鼠标按下，计算当前元素距离可视区的距离
          let disX = e.clientX - parent.offsetLeft;
          let disY = e.clientY - parent.offsetTop;
          document.onmousemove = function (e) {
            //通过事件委托，计算移动的距离
            let l = e.clientX - disX;
            let t = e.clientY - disY;
            //将此时的位置传出去
            binding.value({x: l, y: t})
          };
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  );
  export default {
    name: 'dialog-base',
    data() {
      return {
        dialogType: "0",//弹出框类型：0：消息弹出，1：确认弹出，2：:自定义弹出
        options: {},//各种类型弹出框特有参数
        initHeight: "",//初始化高度
        initWidth: "400px",//初始化宽度
        minHeight: "",//最小高度
        minWidth: "",//最小宽度
        levelNum: 0,//层级
        top: 0,//位置;x
        left: 0,//位置：y
        title: '提示',//弹出框标题
        message: null,//弹出框内容
        fullScreen: false,//是否全屏
        zIndex: -1,//显示层级
        oldPosition: {},//存储初始位置
        umMoveClass: ''
      }
    },
    components: {
      "dialog-message": message,
      "dialog-confirm": confirm,
    },
    mounted() {
      this.fullScreen = this.options && this.options.fullScreen ? true : false;
      this.minHeight = this.options && this.options.minHeight ? this.options.minHeight : "";
      this.minWidth = this.options && this.options.minWidth ? this.options.minWidth : "";
      //DOM渲染完成
      this.$nextTick(this.windowResize.bind(this));
      window.onresize = this.windowResize.bind(this);
    },
    methods: {
      greet(val) {
        let x = val.x;
        let y = val.y;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        this.left = x;
        this.top = y;
      },
      closedialog(e) {
        if (this.options && typeof this.options.closeCallback == "function") {
          this.options.closeCallback();
        }
        let pop = this.$refs['dialog-' + this.levelNum];
        if (pop) {
          document.querySelector('body').removeChild(pop);
        }

      },
      //窗口改变时间
      windowResize() {
        if (this.umMoveClass) {//如果为最大化窗口，窗口样式不需改变，仅调用改变窗口的回调函数
          if (this.options && typeof this.options.fullScreenCallback == "function") {
            this.options.fullScreenCallback();
          }
          return;
        }
        let winWidth = document.documentElement.clientWidth;
        let winHeight = document.documentElement.clientHeight;
        let width = this.$refs['dialog-' + this.levelNum].getElementsByClassName("dialog-pop-panel")[0].offsetWidth;
        let height = this.$refs['dialog-' + this.levelNum].getElementsByClassName("dialog-pop-panel")[0].offsetHeight;
        this.top = Math.max(20, (winHeight - height) / 2 - 10);
        this.left = (winWidth - width) / 2;
        if (this.top < 0) this.top = 0;
        if (this.left < 0) this.left = 0;
        this.zIndex = 1000 + this.levelNum * 100;
        this.oldPosition = {
          oldHeigth: this.initHeight,
          oldWidth: this.initWidth,//初始化宽度
          oldtop: this.top,//位置;x
          oldleft: this.left,//位置：y
        }
      },
      //全屏或者恢复弹窗大小的回调
      fullScreenCallback() {
        if (this.options && typeof this.options.fullScreenCallback == "function") {
          this.options.fullScreenCallback();
        }
        if (this.umMoveClass) {//已经是最大化窗口，点击后需要恢复正常大小
          this.umMoveClass = '';
          this.top = this.oldPosition.oldtop;
          this.left = this.oldPosition.oldleft;
          this.initWidth = this.oldPosition.oldWidth;
          this.initHeight = this.oldPosition.oldHeigth;
        } else {
          this.umMoveClass = 'dialog-pop-ummove';
          this.top = 0;
          this.left = 0;
          this.initWidth = "100%";
          this.initHeight = "100%";
        }
      }
    }
  }
</script>
<style>
  * {
    box-sizing: border-box;
  }

  /* 弹出框 */
  .dialog-pop{
    display: block;
    opacity: 1;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1000;
  }
  .dialog-pop-bg{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #000;
    opacity: 0.3;
    filter: alpha(opacity=30);
  }
  .dialog-pop-panel{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    vertical-align: top;

  }
  .dialog-pop-panelmain{
    display: inline-block;
    position: relative;
    width:100%;
    height: 100%;
    padding: 30px 4px 4px;
    border-radius: 4px;
    background-color: #fff;
    vertical-align: top;
  }
  .dialog-pop-top{
    /*display: inline-block;*/
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: transparent;
    cursor: move;
    vertical-align: top;
    border-bottom: 1px solid #eee;
  }
  .dialog-pop-title{
    display: inline-block;
    margin: 0;
    padding: 5px 5px 5px 10px;
    color: #000;
    font-size: 16px;
    line-height: 20px;
    cursor: text;
    text-align: left;
    vertical-align: middle;
  }
  .dialog-pop-icon{
    display: inline-block;
    float: right;
    width: 26px;
    height: 30px;
    margin: 0;
    padding: 6px 4px;
    border: 0;
    cursor: pointer;
    vertical-align: middle;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: 4px 6px;
  }
  .dialog-pop-icon:hover{
    color: #fff;
  }
  .dialog-pop-full:hover{
    background-color: #587FC6;
  }
  .dialog-pop-full:active{
    background-color: #486CAC;
  }
  .dialog-pop-full:focus{
    outline: 0;
  }
  .dialog-pop-close:hover{
    background-color: #FB6155;
  }
  .dialog-pop-close:active{
    background-color: #EC4839;
  }
  .dialog-pop-close:focus{
    outline: 0;
  }

  .dialog-pop-body{
    display: inline-block;
    width:100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #fff;
    vertical-align: top;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .dialog-pop-ummove .dialog-pop-top{
    cursor: default;
  }
  .dialog-pop-ummove .icon-danchuchuang:before {
    content: "\e601";
  }

  /* 弹出框：信息显示 */
  .dialog-msg{
    display: inline-block;
    position: relative;
    /*width: 400px;
    min-height: 50px;*/
    width: 100%;
    min-height: 100%;
    background-color: #fff;
  }
  .dialogmsg-content{
    width: 100%;
    padding: 20px 15px 10px 70px;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }
  .dialogicon{
    position: absolute;
    top: 10px;
    left: 20px;
    width: 40px;
    height: 40px;
    background-color: transparent;
    background-position: 0 0;
    background-repeat: no-repeat;
  }
  .dialogicon-1{
    background-image: url(../../assets/box_ordinary_icon.png);
  }
  .dialogicon-2{
    background-image: url(../../assets/box_caveat_icon.png);
  }
  .dialogicon-3{
    background-image: url(../../assets/box_error_icon.png);
  }
  .dialogicon-4{
    background-image: url(../../assets/box_questions_icon.png);
  }
  .dialogmsg-bottom{
    width: 100%;
    padding: 10px 10px;
    text-align: right;
  }
  .dialogmsg-detail{
    position: relative;
    width: 100%;
    height: 160px;
    margin-top: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    text-align: left;
    overflow-y: auto;
    overflow-x: hidden;
    word-break: break-all;
    font-size: 12px;
    line-height: 20px;
  }
  .dialogconf-content{
    width: 100%;
    padding: 20px 20px 10px 70px;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }
  .dialogconf-bottom{
    width: 100%;
    padding: 10px 10px;
    text-align: right;
  }

  /* 弹出框：按钮 */
  .dialogbtn-detail{
    padding: 0;
    margin: 0px 5px;
    font-size: 12px;
    line-height: 20px;
    border-width: 0;
    color: #35C9C3;
    background-color: transparent;
    vertical-align: middle;
    cursor: pointer;
  }
  .dialogbtn-detail:hover{
    color: #0AB097;
  }
  .dialogbtn-detail:active{
    color: #059A84;
  }
  .dialogbtn-detail:focus{
    outline: 0;
  }
  .dialogbtn-ddown{
    display: inline-block;
    width: 16px;
    height: 7px;
    margin: 0;
    padding: 0;
    border: 0;
    background-color: transparent;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-image: url(../../assets/box_detail_down.png);
    vertical-align: middle;
  }
  .dialogbtn-dup{
    display: inline-block;
    width: 16px;
    height: 7px;
    margin: 0;
    padding: 0;
    border: 0;
    background-color: transparent;
    background-position: 0 0;
    background-repeat: no-repeat;
    background-image: url(../../assets/box_detail_up.png);
    vertical-align: middle;
  }
  .dialog-btn{
    padding: 4px 15px;
    font-size: 12px;
    line-height: 1.5;
    color: #ffffff;
    border-color: #EF9360;
    vertical-align: middle;
    border: 1px solid transparent;
  }

  .dialogbtn-submit{
    background-color: #EF9360;
  }
  .dialogbtn-submit:hover {
    background-color: #EA712E;
  }
  .dialogbtn-close{
    background-color: #51B4EA;
  }
  .dialogbtn-close:hover {
    background-color: #1294DA;
  }
  .dialogbtn-yes{
    background-color: #19BFB8;
  }
  .dialogbtn-yes:hover{
    background-color: #0AB097;
  }
  .dialogbtn-yes:active{
    background-color: #059A84;
  }
  .dialogbtn-yes:disabled{
    background-color: #b6b6b6;
  }
</style>
