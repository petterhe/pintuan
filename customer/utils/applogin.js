var app = getApp()

const api = require('/api.js')
const request = require('/request.js')

//初始化
function initApp(that) {
  if (app == null) {
    app = that
    //定位
    getUserLocation()
  }
}

//登录
function userlogin() {
  wx.login({
    success: res => {
      var code = res.code
      var nickname = ''
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            //已经授权，可以直接使用 getUserInfo 获取头像昵称 不会弹框
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                nickname = res.userInfo.nickName

                lxpLogin(code, nickname, res)
              }
            })
          } else {
            lxpLogin(code, nickname)
          }
        }
      })
    }
  })
}

function lxpLogin(code, nickname, loginInfo = null) {
  var _param = {
    code: code,
    nickname: nickname,
  }

  if (loginInfo) {
    _param.rawData = loginInfo.rawData
    _param.encryptedData = loginInfo.encryptedData
    _param.iv = loginInfo.iv
  }

  var _success = function (res) {
    if (res.data != null && res.data.Entity != null) {
      var customerInfo = res.data.Entity.CustomerInfo
      app.globalData.CustomerInfo = customerInfo
    }
  }
  var _fail = function (res) {

  }
  var _complete = function (res) {

  }
  request.requestPost(api.CustomerWXLoginService, _param, _success, _fail, _complete)
}

//定位
function getUserLocation() {
  //获取位置授权信息
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.userLocation']) {
        wx.authorize({
          scope: 'scope.userLocation',
          success() { //这里是用户同意授权后的回调
            wx.getLocation({
              type: 'wgs84',
              success: (res) => {
                var latitude = res.latitude
                var longitude = res.longitude
                app.globalData.latitude = latitude
                app.globalData.longitude = longitude
              }
            })
          },
          fail() { //这里是用户拒绝授权后的回调
            app.globalData.latitude = null
            app.globalData.longitude = null
          }
        })
      } else { //用户已经授权过了
        wx.getLocation({
          type: 'wgs84',
          success: (res) => {
            var latitude = res.latitude
            var longitude = res.longitude
            app.globalData.latitude = latitude
            app.globalData.longitude = longitude
          },
          fail: function () {
            app.globalData.latitude = null
            app.globalData.longitude = null
          }
        })
      }
    }
  })
}

//获取团长信息
function getPartnerInfoService(PartnerSysNo, CutomerSysNo, callback) {
  var _param = {
    PartnerSysNo: PartnerSysNo, //团长编号
    CutomerSysNo: CutomerSysNo, //客户编号
  }
  var _success = function (res) {

    if (res.data != null && res.data.Entity != null) {
      app.globalData.PartnerInfo = res.data.Entity
      callback(res.data.Entity)

    } else {
      callback(0)
    }
  }
  var _fail = function (res) {

  }
  request.requestGet(api.GetPartnerInfoService, _param, _success, _fail, null)
}

//获取分享图片
function getWXShareImgService(param, callback) {

  // console.log('hhhhhhkkk==678000==000===', param)
  // wx.showLoading({
  //   title: '加载中...',
  // })
  var _param = {
    PartnerSysNo: param.PartnerSysNo, //团长编号
    CustomerSysNo: param.CustomerSysNo, //客户编号
    PlanSysNo: param.PlanSysNo, //计划号
    ShareSceneType: param.ShareSceneType, //分享场景 AppEnum.ShareSceneType 1 对话 2 朋友圈
    SharePageType: param.SharePageType, //页面类型 参见枚举 SharePageType
  }
  var _success = function (res) {
    if (res.data != null && res.data.Entity != null) {
      callback(res.data.Entity.ImgUrl)
    } else {

    }
  }
  var _fail = function (res) {

  }
  var _complete = function () {
    wx.hideLoading()
  }
  request.requestGet(api.GetWXShareImgService, _param, _success, _fail, _complete)
}

//更新客户手机等信息
function updateCustomerInfoService(customerSysNo, phone, nickName, avatarUrl) {
  var _param = {
    CustomerSysNo: customerSysNo,
    Phone: phone,
    nickName: nickName,
    avatarUrl: avatarUrl,
  }
  var _success = function (res) {
    if (res.data != null && res.data.Entity != null) {
      app.globalData.CustomerInfo = res.data.Entity.CustomerInfo
    } else {

    }
  }
  var _fail = function (res) {

  }
  request.requestPost(api.UpdateCustomerInfoService, _param, _success, _fail, null)
}

//获取项目配置
function getSysDataConfig() {
  var _param = {}
  var _success = function (res) {
    if (res.data != null && res.data.Entity != null) {
      app.globalData.sysDataConfig = res.data.Entity
      getSysDataConfigValue("MiniAppName")
      //存储本地用户
      wx.setStorage({
        key: "sysDataConfig_key",
        data: res.data.Entity
      })
      console.log('项目配置SysDataConfig=====', res.data.Entity)
    } else {

    }
  }
  var _fail = function (res) {
    //获取本地用户
    wx.getStorage({
      key: "sysDataConfig_key",
      success: function (res) {
        // success
        if (res != null && res.data != null && res.data.length > 0) {
          app.globalData.sysDataConfig = res.data
          getSysDataConfigValue("MiniAppName")
        }
      }
    })
  }
  request.requestGet(api.GetSysDataConfigService, _param, _success, _fail, null)
}

//根据key 获取项目配置 对应内容
function getSysDataConfigValue(key) {
  if (app.globalData.sysDataConfig == null || app.globalData.sysDataConfig.length == 0) {
    return
  }
  for (var i = 0; i < app.globalData.sysDataConfig.length; i++) {
    var config = app.globalData.sysDataConfig[i]
    if (config != null && config.ConfigType.toLowerCase() == key.toLowerCase()) {
      app.globalData.miniAppName = config.Value
    }
  }
}

function getShareInfo(shareTicket, path, logtype, callback) {
  console.log('开始获取分享群信息~~~~~~~~~~~~~~~~~~')
  wx.getShareInfo({
    shareTicket: shareTicket,
    success: function (res) {
      console.log('获取分享群信息成功:' + JSON.stringify(res))
      //保存
      // saveShareInfo(res, shareTicket, path, logtype)
      var data = {};
      if (app.globalData.CustomerInfo != null) {
        data.CustomerSysNo = app.globalData.CustomerInfo.SysNo
      }
      data.LogType = logtype

      data.path = path
      data.shareTicket = shareTicket
      data.openid = app.globalData.CustomerInfo.WXOpenId
      // data.rawData = res.rawData
      data.encryptedData = res.encryptedData
      data.iv = res.iv

      console.log('提交分享群信息日志', app.globalData.CustomerInfo)

      var _success = function (res) {
        console.log('提交分享群信息日志============', res)
        if (res.data != null && res.data.Entity != null && res.data.Entity.OpenGInfo != null) {
          callback(res.data.Entity.OpenGInfo)
        } else {
          callback(0)
        }
      }
      var _fail = function (res) {
        callback(0)
      }
      request.requestPost(api.SaveWXShareLogService, data, _success, _fail, null)
    },
    fail: function (res) {
      saveNoTicketShareInfo(path, logtype)
    },
    complete: function (res) { },
  })
}

function saveNoTicketShareInfo(path, logtype) {
  var data = {};

  if (app.globalData.CustomerInfo != null) {
    data.CustomerSysNo = app.globalData.CustomerInfo.SysNo
  }
  data.LogType = logtype
  data.path = path
  data.openid = app.globalData.CustomerInfo.WXOpenId
  var _success = function (res) {

  }
  var _fail = function (res) {

  }
  request.requestPost(api.SaveWXShareLogService, data, _success, _fail, null)
}

module.exports = {
  initApp: initApp,
  userlogin: userlogin,
  updateCustomerInfoService: updateCustomerInfoService,
  getPartnerInfoService: getPartnerInfoService,
  getSysDataConfig: getSysDataConfig,
  getWXShareImgService: getWXShareImgService,
  getShareInfo: getShareInfo,
  saveNoTicketShareInfo: saveNoTicketShareInfo,
}