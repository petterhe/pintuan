// pages/withdraw/withdraw.js

var app = getApp()
const api = require('../../utils/api.js')
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //提现说明
  withdrawDescClick:function(){
    wx.navigateTo({
      url: '../withdrawdesc/withdrawdesc',
    })
  },
})