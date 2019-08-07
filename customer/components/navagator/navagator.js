Component(
  {
  properties: 
  {
    content: String,
    key: String
  },
  methods: {
    //点击组件
    clickContent: function (e) {
      //detail对象，提供给事件监听函数
      var myEventDetail ={}
      // 微信小程序中是通过triggerEvent来给父组件传递信息的
      myEventDetail.key = e.currentTarget.dataset.index
      this.triggerEvent('toNextPage', myEventDetail)
    },
  },

  externalClasses: ['custom-class']
});
