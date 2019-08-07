// pages/myearnings/earningsdetail.js

var app = getApp()
const api = require('../../utils/api.js')
const request = require('../../utils/request.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    scrollHeight: app.globalData.systemInfo.windowHeight,
    detailList:null,   //收益明细
    date: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    var date = options.date
    that.data.date = date
    //团长收益明细
    that.getPartnerProfitLogService()

    wx.setNavigationBarTitle({
      title: date,
    })

    var ipxHeight = that.data.isIpx ? 68 : 0
    var windowHeight = (app.globalData.systemInfo.windowHeight * (750 / app.globalData.systemInfo.windowWidth));
    var scrollHeight = windowHeight - 85 - ipxHeight
    that.setData({
      scrollHeight: scrollHeight,
    })
  },
  //团长收益明细
  getPartnerProfitLogService: function () {
    var _param = {
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      DateFrom: that.data.date,
      DateTo: that.data.date,
      LogType: 1, // 记录类型 非必填 参见枚举 ProfitLogType 
    }
    var _success = function (res) {
      console.log("hjhjhhj-团长收益明细===11166666=", res.data.Entity)
      if (res.data != null && res.data.Entity.length > 0) {
        console.log("hjhjhhj-团长收益明细===8888=", res.data.Entity)
        var list = res.data.Entity
        that.setData({
          detailList: list,
        });
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetPartnerProfitLogService, _param, _success, _fail, null)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})