// pages/myearnings/myearnings.js

var app = getApp()
const api = require('../../utils/api.js')
const method = require('../../utils/method.js')
const request = require('../../utils/request.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProfitAmt: '0.00',     //收益
    ForecastProfitAmt: '0.00',    //预估收益
    tabsMore: ["收益明细", "预估收益"],
    isIpx: app.globalData.isIpx ? true : false,
    leftScrollHeight: 0,
    rightScrollHeight: 0,
    listDateDetail: [], //每日收益
    forecastEarnings: [],   //预估收益
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this

    //团长每日收益
    that.getPartnerDateProfitService()
    //获取团长未结算收益(预估收益)
    that.getPartnerUnSettleProfitService()

    var ipxHeight = that.data.isIpx ? 45 : 0
    var windowHeight = app.globalData.systemInfo.windowHeight
    var topMessageViewHeight = 280 / 750 * app.globalData.systemInfo.windowWidth
    var rightScrollTitleHeight = 80 / 750 * app.globalData.systemInfo.windowWidth
    var leftScrollHeight = windowHeight - 45 - topMessageViewHeight - ipxHeight
    var rightScrollHeight = windowHeight - 45 - topMessageViewHeight - rightScrollTitleHeight - ipxHeight
    
    that.setData({
      ProfitAmt: parseFloat(options.ProfitAmt) == 0 ? '0.00' : options.ProfitAmt,
      leftScrollHeight: leftScrollHeight,
      rightScrollHeight: rightScrollHeight,
    })
  },
  //团长每日收益
  getPartnerDateProfitService: function() {
    var _param = {
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      DateFrom: method.getThirdyDate(),
      DateTo: method.getNowDate(),
    }
    var _success = function(res) {
      if (res.data != null && res.data.Entity != null) {
        var list = res.data.Entity.listDateDetail
        that.setData({
          listDateDetail: list,
        });
      }
    }
    var _fail = function(res) {

    }
    request.requestGet(api.GetPartnerDateProfitService, _param, _success, _fail, null)
  },
  //获取团长未结算收益(预估收益)
  getPartnerUnSettleProfitService:function() {
    var _param = {
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
    }
    var _success = function (res) {
      if (res.data != null && res.data.Entity != null) {
        var list = res.data.Entity.listDetail
        that.setData({
          forecastEarnings: list,
          ForecastProfitAmt: parseFloat(res.data.Entity.ProfitAmt) == 0 ? '0.00' : res.data.Entity.ProfitAmt,
        });
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetPartnerUnSettleProfitService, _param, _success, _fail, null)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onChange: function (event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  clicktoearningsdetail: function(e){
    console.log(e)
    var date = e.currentTarget.dataset.strdate
    wx.navigateTo({
      url: '../myearnings/earningsdetail?date=' + date,
    })
  },
})