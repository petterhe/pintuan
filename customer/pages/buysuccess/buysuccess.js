// pages/buysuccess/buysuccess.js

var app = getApp()
const method = require('../../utils/method.js')
const appenum = require('../../utils/appenum.js')
const login = require('../../utils/applogin.js')
var that

var PartnerSysNo
var PlanSysNo

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: null, //商品列表
    GroupName: "", //团名称
    DeliveryCode: null, //自提码
    StrExpectDeliveryTime: '', //自提时间
    userInfo: null,
    miniAppName: '',   //小程序名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    //设置分享
    method.showShareMenu()
    console.log('么么么么木=======', options)
    PartnerSysNo = options.PartnerSysNo
    PlanSysNo = options.PlanSysNo
    var listGroupProductJsonStr = options.listGroupProduct
    var listGroupProduct = JSON.parse(listGroupProductJsonStr)
    for (var i = 0; i < listGroupProduct.length; i++) {
      var item = listGroupProduct[i]
      item.ProductImageUrl = decodeURIComponent(item.ProductImageUrl)
    }
    var productDetail = []
    var productNameStr = ''
    for (var i = 0; i < listGroupProduct.length; i++) {
      var item = listGroupProduct[i]
      if (item.BuyQty != 0) {
        var itemParam = {}
        itemParam.ProductName = item.ProductName
        itemParam.BuyQty = item.BuyQty
        productDetail.push(itemParam)
      }
    }
    that.setData({
      DeliveryCode: options.DeliveryCode,
      GroupName: options.GroupName,
      StrExpectDeliveryTime: options.StrExpectDeliveryTime,
      productList: productDetail,
      userInfo: app.globalData.userInfo,
      miniAppName: app.globalData.miniAppName,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var listGroupProduct = that.data.productList
    var productName = ""
    for (var i = 0; i < listGroupProduct.length; i++) {
      var item = listGroupProduct[i]
      if (i == 0) {
        productName = item.ProductName
      }
    }
    //获取分享术语
    var title = method.getSysDataConfigValue("SubmitOrderShareTips")
    if (title.indexOf("{0}") >= 0) {
      title = title.replace("{0}", productName)
    }
    // var path = 'pages/groupdetail/groupdetail?PartnerSysNo=' + PartnerSysNo + '&PlanSysNo=' + PlanSysNo
    // path = method.getSharePath(path)
    // console.log(path)

    var scene = appenum.SharePageType.PlanDetail.Value + "," + PartnerSysNo + "," + PlanSysNo
    var path = method.getShareScenePath(scene)
    console.log('分享集中处理path==购买成功======', path)

    return {
      title: title,
      path: path,
      success: function (res) {
        if (res.shareTickets && res.shareTickets[0]) {
          //获取分享信息及上报解密
          login.getShareInfo(res.shareTickets[0], path, appenum.ShareLogType.Share.Value, function (res) { })
        } else {
          login.saveNoTicketShareInfo(path, appenum.ShareLogType.Share.Value)
        }
      },
      fail: function (res) { }
    }
  },

  goback: function () {
    wx.navigateBack()
  },
})