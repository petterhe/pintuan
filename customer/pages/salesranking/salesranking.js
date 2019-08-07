// pages/salesranking/salesranking.js

var app = getApp()
const api = require('../../utils/api.js')
const request = require('../../utils/request.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankType: 1, //排行类型
    isIpx: app.globalData.isIpx ? true : false,
    tabsMore: ["今日", "昨日", "本周", "本月"],
    scrollHeight: app.globalData.systemInfo.windowHeight - 45,
    ranklist: [], //排行列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    //团长收益排行
    that.getPartnerSalesRankService()

    var ipxHeight = that.data.isIpx ? 45 : 20
    var scrollHeight = app.globalData.systemInfo.windowHeight - 45 - ipxHeight
    that.setData({
      scrollHeight: scrollHeight,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // that.data.rankType = 1
  },

  //团长收益排行
  getPartnerSalesRankService: function() {
    var _param = {
      RankType: that.data.rankType, //排行类型
    }
    var _success = function(res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var list = res.data.Entity
          if (list.length > 0) {
            var firstOrderAmt = parseFloat(list[0].OrderAmt)
            var maxwidth = 420
            for (var i = 0; i < list.length; i++) {
              var item = list[i]
              if (firstOrderAmt > 0) {
                //柱状图长度
                item.histogramlength = parseFloat(item.OrderAmt) / firstOrderAmt * maxwidth
              }else{
                //柱状图长度
                item.histogramlength = 0
              }
              //排名图片
              var imageScr = ''
              if (item.RankNum == 1) {
                imageScr = '../../assets/images/rank-num1.png'
              } else if (item.RankNum == 2) {
                imageScr = '../../assets/images/rank-num2.png'
              } else if (item.RankNum == 3) {
                imageScr = '../../assets/images/rank-num3.png'
              }
              item.imageSrc = imageScr
            }

          }
          that.setData({
            ranklist: list,
          });
        } else {
          that.setData({
            ranklist: [],
          });
        }
      } else {
        that.setData({
          ranklist: [],
        });
      }
    }
    var _fail = function(res) {
      that.setData({
        ranklist: [],
      });
    }
    request.requestGet(api.GetPartnerSalesRankService, _param, _success, _fail, null)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  onChange: function(event) {
    that.data.rankType = event.detail.index + 1
    //团长收益排行
    that.getPartnerSalesRankService()
  },
})