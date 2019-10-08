<template>
  <div class="dialog-msg">
    <div class="dialogmsg-content">{{message}}</div>
    <i v-bind:class="'dialogicon '+iClass"></i>
    <div class="dialogmsg-bottom">
      <button class="dialogbtn-detail" type="button" v-if="options.detailMessage!=''" v-on:click="showDetail"><i
        v-bind:class="detailClass"></i>显示详细信息
      </button>
      <button class="dialog-btn dialogbtn-submit" type="button" v-on:click="closedialog">确认</button>
      <transition name="fade">
        <div class="dialogmsg-detail" v-if="isShowDetail" v-bind:style="'overflow:'+overflow">
          {{options.detailMessage}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dialog-message',
    props: {
      message: {
        type: String,
        required: true
      },
      options: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        isShowDetail: false,
        levelNum: 20,
        iClass: 'dialogicon-1',
        detailClass: 'dialogbtn-ddown',
        overflow: 'hidden'
      }
    },
    mounted() {
      if (this.options && this.options.iType) {
        this.iClass = "dialogicon-" + this.options.iType;
      }
    },
    methods: {
      closedialog: function () {
        if (this.options && typeof this.options.callbackMessageOK === "function") {
          this.options.callbackMessageOK(111);
        }
        this.$parent.closedialog();

      },
      showDetail: function () {
        if (this.isShowDetail) {
          this.isShowDetail = false;
          this.overflow = "hidden";
          this.detailClass = "dialogbtn-ddown"
        } else {
          this.isShowDetail = true;
          this.detailClass = "dialogbtn-dup";
          this.overflow = "auto";

        }
      }
    }
  }
</script>
