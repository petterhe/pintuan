// pages/home/home.js
var app = getApp()
const api = require('../../utils/api.js')
const appenum = require('../../utils/appenum.js')
const request = require('../../utils/request.js')
const method = require('../../utils/method.js')
const login = require('../../utils/applogin.js')

var that

var PartnerSysNo
var FromUserSysNo
var CustomerSysNo

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    PartnerStatusStr: '', //团长状态
    PartnerStatusTap: false, //团长状态是否可以切换

    CustomerInfo: null, //登录成功后用户信息数据
    GroupingList: null, //团购列表
    PartnerInfo: null, //团长信息
    PartnerProfit: null, //团长收益
    PartnerGradeIcon: '', //团长等级icon

    isShowPartnerReceive: 0,   //是否显示团长签收
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this
    console.log("home========", options, options.PartnerSysNo)
    //设置分享
    method.showShareMenu()
    //团长
    if (options.PartnerSysNo) {
      PartnerSysNo = options.PartnerSysNo
    } else {
      if (app.globalData.PartnerInfo) {
        PartnerSysNo = app.globalData.PartnerInfo.PartnerSysNo
      }
    }
    //用来判断打开来源用户
    if (options.FromUserSysNo) {
      app.globalData.FromUserSysNo = options.FromUserSysNo
    }
    //递归刷新数据
    that.refreshPageData()
  },
  //递归刷新数据
  refreshPageData: function () {

    // if (app.globalData.CustomerInfo == null) {
    //   setTimeout(function () {
    //     that.refreshPageData()
    //   }, 500)
    //   return
    // }

    var isShowPartnerReceive = method.getSysDataConfigValue("IsShowPartnerReceive")
    that.setData({
      isShowPartnerReceive: isShowPartnerReceive,
    })

    //用户编号
    CustomerSysNo = app.globalData.CustomerInfo.SysNo
    //如果团长
    if (app.globalData.CustomerInfo.CustomerType == 1) {
      //团长打开 团长编号变成自己
      if (PartnerSysNo != app.globalData.CustomerInfo.PartnerSysNo) {
        PartnerSysNo = app.globalData.CustomerInfo.PartnerSysNo
        //团长信息置空
        app.globalData.PartnerInfo = null
      }
    }
    //团长信息为空 需要先获取团长信息
    if (app.globalData.PartnerInfo == null || parseInt(app.globalData.PartnerInfo.PartnerSysNo) != PartnerSysNo) {
      //团长信息
      login.getPartnerInfoService(PartnerSysNo, CustomerSysNo, function (res) {
        if (res == 0) { //团长无效
          wx.showToast({
            title: '团长信息无效',
            icon: 'none',
            duration: 1000,
            success: function () {
              setTimeout(function () {

                var pageArray = getCurrentPages()
                if (pageArray.length > 1) {
                  wx.navigateBack()
                } else {
                  wx.redirectTo({
                    url: '../../pages/usercenter/usercenter',
                  })
                }
              }, 1000) //延迟时间
            }
          })
        } else { //团长有效
          that.getDetailMessage()
        }
      })
    } else {
      that.getDetailMessage()
    }
  },
  getDetailMessage: function () {
    //获取拼团中列表
    this.getGetGroupingListService()
    //获取团长收益
    this.getPartnerProfitService()
    var partnerGradeIcon
    partnerGradeIcon = '../../assets/images/home-shimingrenzheng.png'
    that.detailPartnerInfo()
    that.setData({
      CustomerInfo: app.globalData.CustomerInfo,
      PartnerInfo: app.globalData.PartnerInfo,
      PartnerGradeIcon: partnerGradeIcon,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.detailPartnerInfo()
    that.setData({
      PartnerInfo: app.globalData.PartnerInfo,
    })

    //获取团长最新状态
    that.getCustomerCacheService()
  },
  //获取团长最新状态
  getCustomerCacheService: function () {
    var _param = {
      CustomerSysNo: PartnerSysNo,
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var partnerInfo = app.globalData.PartnerInfo
          if (partnerInfo) {
            partnerInfo.Status = res.data.Entity.PartnerStatus
            app.globalData.PartnerInfo = partnerInfo
            that.detailPartnerInfo()
          }
          var customerInfo = app.globalData.CustomerInfo
          if (customerInfo) {
            if (customerInfo.CustomerType == 1) { //团长
              customerInfo.CustomerType = res.data.Entity.CustomerType
              app.globalData.CustomerInfo = customerInfo
            }
          }
        }
      }
    }
    request.requestGet(api.GetCustomerCacheService, _param, _success, null, null)
  },

  detailPartnerInfo: function () {
    var PartnerInfo = app.globalData.PartnerInfo
    if (PartnerInfo) {
      var partnerStatusStr
      var partnerStatusTap = false
      if (app.globalData.CustomerInfo.CustomerType == 1) { //团长
        if (PartnerInfo.Status == 1) {
          partnerStatusStr = '  工作中  '
        } else if (PartnerInfo.Status == 2) {
          partnerStatusStr = '  休息中  '
        }
        partnerStatusTap = false
      } else { //用户
        if (PartnerInfo.Status == 1) {
          partnerStatusStr = ''
        } else if (PartnerInfo.Status == 2) {
          partnerStatusStr = '  休息中  '
        }
        partnerStatusTap = false
      }
      that.setData({
        PartnerStatusTap: partnerStatusTap,
        PartnerStatusStr: partnerStatusStr,
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //获取拼团中列表
    this.getGetGroupingListService()
    //获取团长收益
    this.getPartnerProfitService()

    wx.stopPullDownRefresh()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //获取分享术语
    var title = method.getSysDataConfigValue("PartnerHomeShareTips")
    var imageurl = method.getSysDataConfigValue("PartnerHomeShareImg")
    if (title.length == 0) {
      title = that.data.PartnerInfo.PartnerName
    }
    if (imageurl.length == 0) {
      imageurl = that.data.PartnerInfo.PartnerImageUrl
    }
    // var path = 'pages/home/home?PartnerSysNo=' + PartnerSysNo
    // path = method.getSharePath(path)
    // console.log(path)

    var scene = appenum.SharePageType.PartnerHome.Value + "," + PartnerSysNo
    var path = method.getShareScenePath(scene)
    console.log('分享集中处理path=====团长首页======', path)
    return {
      title: title,
      path: path,
      imageUrl: imageurl,
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
  //获取拼团中列表
  getGetGroupingListService: function () {
    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      PartnerSysNo: PartnerSysNo, //团长编号
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            GroupingList: res.data.Entity,
          });
        }
      } else {
        // notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGroupingListService, _param, _success, _fail, null)
  },
  //获取团长收益
  getPartnerProfitService: function () {
    var _param = {
      PartnerSysNo: PartnerSysNo, //团长编号
      CustomerSysNo: CustomerSysNo, //客户编号
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        that.setData({
          PartnerProfit: res.data.Entity,
        });
      } else {
        // notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) { }
    request.requestGet(api.GetPartnerProfitService, _param, _success, _fail, null)
  },
  //跳转分享
  clicktoshare: function () {

  },
  //跳转到个人中心
  clicktohome: function () {
    wx.navigateTo({
      url: '../usercenter/usercenter',
    })
  },
  //跳转到店铺地图
  clicktoaddressmap: function () {
    const latitude = parseFloat(this.data.PartnerInfo.Latitude)
    const longitude = parseFloat(this.data.PartnerInfo.Longitude)
    wx.openLocation({
      latitude,
      longitude,
      name: this.data.PartnerInfo.Placemarks,
      address: this.data.PartnerInfo.Address,
      scale: 14
    })
  },
  //跳转到团购详情
  navigateDetail: function (e) {
    var PlanSysNo = e.currentTarget.dataset.plansysno
    wx.navigateTo({
      url: '../groupdetail/groupdetail?PlanSysNo=' + PlanSysNo,
    })
  },
  //点击头像
  clicktocreatestore: function (e) {

  },
  //切换团长状态
  changepartnerstatues: function () {

    var PartnerInfo = app.globalData.PartnerInfo
    var partnerStatus
    if (PartnerInfo) {
      if (PartnerInfo.Status == 1) {
        partnerStatus = 2
        wx.showModal({
          title: '温馨提示',
          content: '确认休假吗？',
          success(res) {
            if (res.confirm) {
              that.partnerVacationService(partnerStatus)
            }
          }
        })
      } else if (PartnerInfo.Status == 2) {
        partnerStatus = 1
        that.partnerVacationService(partnerStatus)
      }
    }
  },
  partnerVacationService: function (partnerStatus) {
    var _param = {
      PartnerSysNo: PartnerSysNo, //团长编号
      Status: partnerStatus, //状态 1 工作中 2休假
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          app.globalData.PartnerInfo = res.data.Entity
          that.detailPartnerInfo()
        }
      } else { }
    }
    var _fail = function (res) {

    }
    request.requestPost(api.PartnerVacationService, _param, _success, _fail, null)
  },
  //到货确认
  parRecOrderShoppingService: function () {

    wx.showModal({
      title: '温馨提示',
      content: '您确认已收货了？',
      success(res) {
        if (res.confirm) {
          var _param = {
            PartnerSysNo: PartnerSysNo, //团长编号
            DeliveryDate: method.getNowDate(), //收货日期
          }
          var _success = function (res) {
            if (res.data.ResponseStatus.ErrorCode == 0) {
              method.showToast('到货确认成功', 1);
            } else {
              method.showToast(res.data.ResponseStatus.Message, -1);
            }
          }
          var _fail = function (res) {
            method.showToast('连接服务器失败', -1);
          }
          request.requestPost(api.ParRecOrderShoppingService, _param, _success, _fail, null)
        } else if (res.cancel) {

        }
      }
    })
  },
  openIndexPage: function (e) {

    var index = e.currentTarget.dataset.index
    if (index == 1) {
      // console.log("收益")
      wx.navigateTo({
        url: '../myearnings/myearnings?ProfitAmt=' + that.data.PartnerProfit.ProfitAmt / 100,
      })
    } else if (index == 2) {
      // console.log("订单")
      wx.navigateTo({
        url: '../order/ordermanage',
      })
    } else if (index == 3) {
      // console.log("账户")
      wx.navigateTo({
        url: '../editmessage/editmessage',
      })
    } else if (index == 4) {
      // console.log("销售报表")
      wx.navigateTo({
        url: '../salesreport/salesreport',
      })
    } else if (index == 5) {
      // console.log("活跃度")
      wx.navigateTo({
        url: '../salesranking/salesranking',
      })
    } else if (index == 6) {
      // console.log("到货确认")
      that.parRecOrderShoppingService()
    }
  },
})