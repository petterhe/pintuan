var that
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  toNextPage: function (e) {
    var index = e.detail.key
    switch (index) {
      case "1":
        that.toOrderListPage();
        break;
      case "2":
        that.toOrderProductListPage();
        break;
      case "3":
        that.toOrderQueryPage();
        break;
    }
  },
  //进入订单列表页
  toOrderListPage: function () {
    var murl = "./orderlist"
    wx.navigateTo({
      url: murl
    })
  },

  //进入订单商品列表页
  toOrderProductListPage: function () {
    var murl = "./orderproductlist"
    wx.navigateTo({
      url: murl
    })
  },
  //进入我的订单
  toOrderQueryPage: function () {
    var murl = "./ordermine"
    wx.navigateTo({
      url: murl
    })
  },
})