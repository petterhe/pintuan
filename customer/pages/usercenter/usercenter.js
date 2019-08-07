// pages/usercenter/usercenter.js
import Notify from '../../zanui/dist/notify/notify.js'
//获取应用实例
const app = getApp()
const api = require('../../utils/api.js')
const appenum = require('../../utils/appenum.js')
const request = require('../../utils/request.js')
const login = require('../../utils/applogin.js')
const method = require('../../utils/method.js')

var that

Page({
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    userInfo: {},
    hasUserInfo: false,
    joinlist: null, //我参与的团
    options: null,
    userCenterOptions: null,
    launchOptions: null, //app.js启动options
    visitlist: null, //访问的店
    nearbyStoreList: [], //附近门店

    showGisPartner: false, //是否展示附近店铺 默认展示
    storePlacemarks: '切换位置',
    latitude: null,
    longitude: null,
  },

  onLoad: function (options) {
    that = this
    // if (options) {
    that.data.userCenterOptions = options
    // }
    that.refreshPageData()
  },
  onShow: function () {

    if (app.globalData.CustomerInfo) {
      //我的订单
      this.getCusOrderListService()
      //我访问的店
      this.getCustomerAccessPartnerService()
      //获取附近门店
      this.getGisPartnerService()
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //刷新用户信息
    this.customerService()

    wx.stopPullDownRefresh()
  },
  //是否展示附近店铺
  showGisStore: function () {
    var isShowGisPartner = method.getSysDataConfigValue("IsShowGisPartner")
    //console.log("isShowGisPartner", isShowGisPartner);
    var showGisPartner = true
    if (isShowGisPartner && isShowGisPartner == 0) {
      showGisPartner = false
    } else {
      showGisPartner = true
    }
    this.setData({
      showGisPartner: showGisPartner,
    });
  },
  //刷新用户信息
  customerService: function () {
    var that = this
    if (app.globalData.CustomerInfo != null) {
      var _param = {
        CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      }
      var _success = function (res) {
        if (res.data.ResponseStatus.ErrorCode == 0) {
          if (res.data != null && res.data.Entity != null) {
            app.globalData.CustomerInfo = res.data.Entity.CustomerInfo
            if (app.globalData.CustomerInfo.CustomerType == 1) {
              wx.redirectTo({
                url: '../home/home',
              })
            } else {
              //我的订单
              that.getCusOrderListService()
              //我访问的店
              that.getCustomerAccessPartnerService()
              //获取附近门店
              that.getGisPartnerService()
            }
          }
        } else {
          // notify(res.data.ResponseStatus.Message)
        }
      }
      var _fail = function (res) {

      }
      request.requestGet(api.CustomerService, _param, _success, _fail, null)
    }
  },
  //我参与的团
  getCusOrderListService: function () {
    var that = this
    var customerSysNo = ''
    if (app.globalData.CustomerInfo != null) {
      customerSysNo = app.globalData.CustomerInfo.SysNo
    }
    var _param = {
      CustomerSysNo: customerSysNo, //客户编号
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            joinlist: res.data.Entity,
          });
        }
      } else {
        // notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetCusOrderListService, _param, _success, _fail, null)
  },
  //我访问的店
  getCustomerAccessPartnerService: function () {
    var that = this
    var customerSysNo = ''
    if (app.globalData.CustomerInfo != null) {
      customerSysNo = app.globalData.CustomerInfo.SysNo
    }
    var _param = {
      CustomerSysNo: customerSysNo, //客户编号
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            visitlist: res.data.Entity,
          });
        }
      } else {
        // notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetCustomerAccessPartnerService, _param, _success, _fail, null)
  },

  //获取附近门店
  getGisPartnerService: function () {
    var that = this
    var customerSysNo = ''
    if (app.globalData.CustomerInfo != null) {
      customerSysNo = app.globalData.CustomerInfo.SysNo
    }
    var latitude, longitude
    if (that.data.latitude != null && that.data.longitude != null) {
      latitude = that.data.latitude
      longitude = that.data.longitude
    } else {
      latitude = app.globalData.latitude
      longitude = app.globalData.longitude
    }
    var _param = {
      CustomerSysNo: customerSysNo, //客户编号
      GisLatitude: latitude,
      GisLongitude: longitude
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          that.setData({
            nearbyStoreList: res.data.Entity,
          });
        }
      } else {
        that.setData({
          nearbyStoreList: [],
        });
      }
    }
    var _fail = function (res) {
      that.setData({
        nearbyStoreList: [],
      });
    }
    request.requestGet(api.GetGisPartnerService, _param, _success, _fail, null)
  },

  clickcreatestore: function () {
    wx.navigateTo({
      url: '../createstore/createstore',
    })
  },
  //进入店铺
  clicktostore: function (e) {
    var PartnerSysNo = e.currentTarget.dataset.partnersysno
    wx.navigateTo({
      url: '../home/home?PartnerSysNo=' + PartnerSysNo,
    })
  },
  //跳转到团详情
  clickToGroupDetail: function (e) {
    var PlanSysNo = e.currentTarget.dataset.plansysno
    var PartnerSysNo = e.currentTarget.dataset.partnersysno
    wx.navigateTo({
      url: '../groupdetail/groupdetail?PlanSysNo=' + PlanSysNo + '&PartnerSysNo=' + PartnerSysNo,
    })
  },
  //取消订单
  cancelOrder: function (e) {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '确认需要取消订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '取消中...',
          })
          var sosysno = e.currentTarget.dataset.sosysno
          var _param = {
            CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
            SoSysNo: sosysno,
          }
          var _success = function (res) {
            if (res.data.ResponseStatus.ErrorCode == 0) {
              if (res.data != null && res.data.Entity != null) {
                //我的订单
                that.getCusOrderListService()
                //我访问的店
                that.getCustomerAccessPartnerService()
                //获取附近门店
                that.getGisPartnerService()
              }
            } else {
              notify(res.data.ResponseStatus.Message)
            }
          }
          var _fail = function (res) {

          }
          var _complete = function (res) {
            wx.hideLoading()
          }
          request.requestPost(api.CancelOrderShoppingService, _param, _success, _fail, _complete)
        } else if (res.cancel) {

        }
      }
    })
  },

  //订单签收
  signForOrder: function (e) {
    var that = this
    wx.showLoading({
      title: '签收中...',
    })
    var sosysno = e.currentTarget.dataset.sosysno
    var _param = {
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      SoSysNo: sosysno,
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          //我的订单
          that.getCusOrderListService()
          //我访问的店
          that.getCustomerAccessPartnerService()
          //获取附近门店
          that.getGisPartnerService()
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    var _complete = function (res) {
      wx.hideLoading()
    }
    request.requestPost(api.CusRecOrderShoppingService, _param, _success, _fail, _complete)
  },

  //切换地址
  chooseLocation() {
    let that = this
    method.getPermission(that, null)
  },
  //复制订单编号
  copySOSysNo: function (e) {
    var sosysno = e.currentTarget.dataset.sosysno
    wx.setClipboardData({
      //准备复制的数据
      data: String(sosysno),
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  getUserInfo: function (e) {
    var that = this
    if (e.detail.userInfo != null) {
      app.globalData.userInfo = e.detail.userInfo
      that.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      //更新用户信息
      login.updateCustomerInfoService(app.globalData.CustomerInfo.SysNo, '', e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    } else {
      that.setData({
        hasUserInfo: false
      })
    }
  },
  //递归刷新数据
  refreshPageData: function () {
    if (app.globalData.CustomerInfo == null) {
      setTimeout(function () {
        that.refreshPageData()
      }, 1000)
      return
    }

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已经授权，可以直接使用 getUserInfo 获取头像昵称 不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              that.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })

              //更新用户信息
              login.updateCustomerInfoService(app.globalData.CustomerInfo.SysNo, '', res.userInfo.nickName, res.userInfo.avatarUrl)
            }
          })
        } else {
          that.setData({
            hasUserInfo: false
          })
        }
      }
    })

    //定位权限未开启
    if (app.globalData.latitude == null && app.globalData.longitude == null) {
      that.setData({
        storePlacemarks: '定位失败'
      })
    }

    //是否展示附近店铺
    that.showGisStore()
    //处理launchOptions
    that.dealLaunchOptions()
  },
  //处理launchOptions
  dealLaunchOptions: function () {
    var userCenterOptions = that.data.userCenterOptions
    if (JSON.stringify(userCenterOptions) == '{}' || userCenterOptions == null) {
      that.detailScene()
    } else {
      //处理shareTicket
      var launchOptions = app.globalData.launchOptions
      if (launchOptions) {
        var pathStr = launchOptions.path
        if (launchOptions.query.scene) {
          pathStr = launchOptions.path + "?scene=" + launchOptions.query.scene
        }
        if (launchOptions.shareTicket) {

          //获取分享信息及上报解密
          login.getShareInfo(launchOptions.shareTicket, pathStr, appenum.ShareLogType.Open.Value, function (res) {
            console.log('获取分享信息及上报解密=====', res)
            if (res == 0) { //获取群信息失败
              that.data.options = that.data.userCenterOptions
              that.detailScene()
            } else {
              app.globalData.fromOpenGId = res.OpenGId
              var sharePartnerSysNo = res.PartnerSysNo
              if (sharePartnerSysNo != 0) {
                var scene = ''
                if (launchOptions.query.scene) {
                  scene = launchOptions.query.scene
                }
                var openType = 0
                var dScene = ''
                //包含特殊符号时，需解码
                if (scene.indexOf("%")) {
                  dScene = decodeURIComponent(scene)
                } else {
                  dScene = scene
                }
                scene = "" //此时可以清空了
                var strScenes = dScene.split(",")

                if (strScenes != null && strScenes.length > 0) {
                  openType = strScenes[0]
                  //首页
                  if (openType == 1) {
                    var PartnerSysNo = strScenes[1]
                    if (PartnerSysNo != null && PartnerSysNo.length > 0) {
                      strScenes.splice(1, 1, sharePartnerSysNo)
                    }
                  }
                  //团购详情
                  if (openType == 2) {
                    var PartnerSysNo = strScenes[1]
                    if (PartnerSysNo != null && PartnerSysNo.length > 0) {
                      strScenes.splice(1, 1, sharePartnerSysNo)
                    }
                  }
                }
                var optionStr = ''
                for (var i = 0; i < strScenes.length; i++) {
                  if (i == 0) {
                    optionStr = strScenes[0]
                  } else {
                    optionStr = optionStr + ',' + strScenes[i]
                  }
                }
                var lastOptions = {}
                lastOptions.scene = optionStr
                that.data.options = lastOptions
                that.detailScene()
              } else {
                that.data.options = that.data.userCenterOptions
                that.detailScene()
              }
            }
          })

        } else {
          that.data.options = that.data.userCenterOptions
          that.detailScene()
          login.saveNoTicketShareInfo(pathStr, appenum.ShareLogType.Open.Value)
        }
      } else {
        that.detailScene()
      }
    }
  },

  detailScene: function () {
    var options = that.data.options
    if (JSON.stringify(options) == '{}' || options == null) {
      if (app.globalData.CustomerInfo.CustomerType == 1) { //团长
        wx.redirectTo({
          url: '../home/home',
        })
      } else {
        //我的订单
        that.getCusOrderListService()
        //我访问的店
        that.getCustomerAccessPartnerService()
        //获取附近门店
        that.getGisPartnerService()
      }
    } else {
      // 团长申请../../ pages / createstore / createstore
      // scene = 3, 1, 1, 2
      // 参数：第1位 OpenType: 3 第二位仓库编号StockSysNo 第3位 师长编号MasterUserSysNo 第4位：来源用户编号 FromUserSysNo

      // 主页../../ pages / home / home
      // scene = 1, 1, 2
      // 参数： 第1位 OpenType: 1  第2位：团长编号PartnerSysNo  第3位：来源用户编号FromUserSysNo

      // 团详情../../ pages / groupdetail / groupdetail
      // scene = 2, 1, 2, 2
      // 参数：  第1位 OpenType: 2   第2位：团长编号PartnerSysNo    第3位：计划号PlanSysNo   第4位：来源用户编号FromUserSysNo
      var scene = ''
      if (!(options.scene == undefined)) {
        scene = options.scene
      }
      var openType = 0
      var dScene = ''
      //包含特殊符号时，需解码
      if (scene.indexOf("%")) {
        dScene = decodeURIComponent(scene)
      } else {
        dScene = scene
      }
      scene = "" //此时可以清空了

      var strScenes = dScene.split(",")

      if (strScenes != null && strScenes.length > 0) {
        openType = strScenes[0]
        //首页
        if (openType == 1) {
          var PartnerSysNo = strScenes[1]
          var FromUserSysNo = strScenes[2]
          if (PartnerSysNo != null && PartnerSysNo.length > 0) {
            wx.redirectTo({
              url: '../home/home?PartnerSysNo=' + PartnerSysNo + '&FromUserSysNo=' + FromUserSysNo,
            })
            return
          }
        }
        //团购详情
        if (openType == 2) {
          var PartnerSysNo = strScenes[1]
          var PlanSysNo = strScenes[2]
          var FromUserSysNo = strScenes[3]
          if (PartnerSysNo != null && PartnerSysNo.length > 0 && PlanSysNo != null && PlanSysNo.length > 0) {
            wx.redirectTo({
              url: '../groupdetail/groupdetail?PartnerSysNo=' + PartnerSysNo + '&PlanSysNo=' + PlanSysNo + '&FromUserSysNo=' + FromUserSysNo,
            })
          }
        }
        //团长申请
        if (openType == 3) {
          var StockSysNo = strScenes[1]
          var MasterUserSysNo = strScenes[2]
          var FromUserSysNo = strScenes[3]
          if (StockSysNo != null && StockSysNo.length > 0 && MasterUserSysNo != null && MasterUserSysNo.length > 0) {
            wx.redirectTo({
              url: '../createstore/createstore?StockSysNo=' + StockSysNo + '&MasterUserSysNo=' + MasterUserSysNo + '&FromUserSysNo=' + FromUserSysNo,
            })
          }
        }
      }
    }
    that.data.userCenterOptions = null
  },
  //挑转到自提地址
  clickToReceiveAddress: function (e) {
    var index = e.currentTarget.dataset.index
    var joinlist = this.data.joinlist
    var orderItem = joinlist[index]
    var latitude = parseFloat(orderItem.Latitude)
    var longitude = parseFloat(orderItem.Longitude)
    wx.openLocation({
      latitude,
      longitude,
      name: orderItem.ReceiveAddress,
      scale: 14
    })
  },
})

function notify(message) {
  Notify({
    duration: 2000,
    text: message,
    selector: '#message-notify',
    backgroundColor: 'red'
  });
}