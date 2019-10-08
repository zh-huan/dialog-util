<template>
  <div class="dialog-msg">
    <div class="dialogconf-content">
      {{message}}
    </div>
    <i class="dialogicon dialogicon-4"></i>
    <div class="dialogconf-bottom">
      <button class="dialog-btn dialogbtn-yes" type="button" v-on:click="yesCallbackFunction"> {{yesText}}</button>
      <button class="dialog-btn dialogbtn-close" type="button" v-on:click="noCallbackFunction"> {{noText}}</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dialog-confirm',
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
        yesText: '确认',
        noText: '取消',
        confirmData: null,
      }
    },
    mounted() {
      if (this.options && this.options.yesText) {
        this.yesText = this.options.yesText;
      }
      if (this.options && this.options.noText) {
        this.noText = this.options.noText;
      }
      if (this.options && this.options.data) {
        this.confirmData = this.options.data;
      }
      this.iClass = "dialogicon-" + this.iType;
    },
    methods: {
      yesCallbackFunction() {
        try {
          if (this.options && typeof this.options.yesCallbackFunction === "function") {
            let result = this.options.yesCallbackFunction(this.confirmData);
            if (typeof result == "boolean" && result == false) {
              return;
            }
          }
        }
        catch (e) {
        }
        this.closeDialog();
      },
      noCallbackFunction() {
        try {
          if (this.options && typeof this.options.noCallbackFunction === "function") {
            let result = this.options.noCallbackFunction(this.confirmData);
            if (typeof result == "boolean" && result == false) {
              return;
            }
          }
        }
        catch (e) {
        }
        this.closeDialog();
      },
      closeDialog() {
        this.confirmData = null;
        this.$parent.closedialog();
      }
    },
  }
</script>
<style>

</style>
