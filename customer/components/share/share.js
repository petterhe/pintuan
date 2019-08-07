Component({
  properties: {
    showShareModel: Boolean,
    firstProduct: Object,
  },

  methods: {
    //关闭分享弹框
    closeview: function() {
      // 微信小程序中是通过triggerEvent来给父组件传递信息的
      this.triggerEvent('closeShareView')
      this.setData({
        showShareModel: false
      })
    },
  },

  externalClasses: ['custom-class']
});