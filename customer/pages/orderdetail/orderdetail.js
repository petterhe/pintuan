// pages/orderdetail/orderdetail.js
var app = getApp()
const api = require('../../utils/api.js')
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    tabsMore: ["按订单分", "按商品分"],
    contentHeight: app.globalData.systemInfo.windowHeight - 45,
    scrollHeight: app.globalData.systemInfo.windowHeight - 45 -35,
    PlanSysNo: '',
    groupOrderList: null,    //按订单分
    groupOrderProductSum: null,    //按商品分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.PlanSysNo = options.PlanSysNo
    //我分享的团-按照订单分
    that.getGroupOrderListService()
    //我分享的团-按照商品分
    that.getGroupOrderProductSumService()

    var ipxHeight = this.data.isIpx ? 45 : 0
    var contentHeight = app.globalData.systemInfo.windowHeight - 45 - ipxHeight
    var scrollHeight = app.globalData.systemInfo.windowHeight - 45 -35 - ipxHeight
    this.setData({
      contentHeight: contentHeight,
      scrollHeight: scrollHeight,
    })
  },
  //我分享的团-按照订单分
  getGroupOrderListService:function(){
    var that = this
    var _param = {
      // CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      PlanSysNo: that.data.PlanSysNo, //计划号
    }
    var _success = function (res) {
      console.log("hjhjhhj----我发起的团==按订单分==11166666=", res.data.Entity)
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            groupOrderList: res.data.Entity,
          });
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGroupOrderListService, _param, _success, _fail, null)
  },
  //我分享的团-按照商品分
  getGroupOrderProductSumService: function () {
    var that = this
    var _param = {
      // CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      PlanSysNo: that.data.PlanSysNo, //计划号
    }
    var _success = function (res) {
      console.log("hjhjhhj----我发起的团==按商品分==11166666=", res.data.Entity)
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            groupOrderProductSum: res.data.Entity,
          });
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGroupOrderProductSumService, _param, _success, _fail, null)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onChange: function (event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  }
})