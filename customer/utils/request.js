var app = getApp()

const md5 = require('../libs/md5.js')
const appenum = require('/appenum.js')
const method = require('/method.js')

//生产环境 false     测试环境 true
const IsDevelop = false
const AppVersion = '1.1.5'
// const WXAppId = 'wx3f786e322cdde149'
const RequestKey = 'KiLPNtRp51Hj98Yr'

//域名配置
const httpTestUrl = "https://testservice.1717sheng.com/"
// const httpTestUrl = "http://10.1.8.13:6200/"
const httpUrl = "https://service.1717sheng.com/"

//初始化
function initApp(that) {
  if (app == null) {
    app = that
  }
}

function requestGet(urlKey, data, doSuccess, doFail, doComplete) {
  data = getRequestDefaultData(data)
  //返回json格式
  data.format = 'json'
  var url = getUrl(urlKey)
  wx.request({
    url: url,
    data: data,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {

      if (res.statusCode == 200) {
        IsDevelop ? console.log(urlKey + " get请求结果==:::::::::::::::::::::::::::::::==", res) : null
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      } else {
        // showToast("很抱歉，服务出现异常", -1);
        showToast(res.data.ResponseStatus.Message, -1);
        if (typeof doFail == "function") {
          doFail();
        }
      }
    },
    fail: function (e) {
      console.log(e)

      showToast("访问服务出错，请检查您的网络", -1);
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

function requestPost(urlKey, data, doSuccess, doFail, doComplete) {
  data = getRequestDefaultData(data)
  //json格式
  var url = getUrl(urlKey) + "?format=json"
  wx.request({
    url: url,
    data: data,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {

        IsDevelop ? console.log(urlKey + " post请求结果==:::::::::::::::::::::::::::::::==", res) : null

        if (typeof doSuccess == "function") {
          //showToast("访问服务成功", -1);
          doSuccess(res);
        }
      } else {
        showToast("访问服务出错", -1);

        if (typeof doFail == "function") {
          doFail();
        }
      }
    },
    fail: function (e) {
      console.log(e)
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

function uploadFile(data, filePath, doSuccess, doFail, progress) {
  data = getRequestDefaultData(data)
  //返回json格式
  data.format = 'json'
  var url = getUrl('WXUploadFileService') + "?format=json";
  const upload_task = wx.uploadFile({
    url: url,
    filePath: filePath,
    name: 'file',
    header: {
      'content-type': 'application/json'
    },
    formData: data,
    success: function (res) {

      IsDevelop ? console.log("上传结果==:::::::::::::::::::::::::::::::==", res) : null

      if (res.statusCode == 200) {
        if (typeof doSuccess == "function") {
          doSuccess(res);
        }
      } else {
        showToast("访问服务出错", -1);
      }
    },
    fail: function (e) {

      console.log(e)
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  })
  upload_task.onProgressUpdate((res) => {

    if (typeof progress == "function") {
      progress(res);
    }
  });
}

//接口底层默认参数
function getRequestDefaultData(data) {
  if (data == null) {
    data = {}
  }
  data.AppID = appenum.AppID.MiniApp_Customer.Value
  data.Version = AppVersion
  data.SalesManSysNo = appenum.SalesManSysNo.WXXCX.Value
  data.ClientType = appenum.ClientType.WXXCX.Value
  //客户端信息
  if (app.globalData.systemInfo != null) {
    //需要url编码，防止特殊符号
    data.DeviceModel = encodeURI(app.globalData.systemInfo.model)
    data.OSVer = app.globalData.systemInfo.system
    data.ClientAppVer = app.globalData.systemInfo.version
    data.ClientSDKVer = app.globalData.systemInfo.SDKVersion
    data.Screen = app.globalData.systemInfo.windowWidth + '*' + app.globalData.systemInfo.windowHeight
  } else {
    app.globalData.systemInfo = wx.getSystemInfoSync()
  }
  //网络状态
  if (app.globalData.networkType != null) {
    data.NetWorkStates = app.globalData.networkType
  } else (
    wx.getNetworkType({
      success: function (res) {
        app.globalData.networkType = res.networkType
      }
    })
  )
  //sign签名
  data.NonceStr = method.newGuid()
  data.TimeStamp = method.getNowTimeSpan()

  if (app.globalData.latitude != null) {
    data.Latitude = app.globalData.latitude
  }
  if (app.globalData.longitude != null) {
    data.Longitude = app.globalData.longitude
  }
  //uuid 默认为 unionId
  if (app.globalData.CustomerInfo != null) {
    data.Uuid = app.globalData.CustomerInfo.WXOpenId
    data.WXUnionid = app.globalData.CustomerInfo.WXUnionid
    data.WXOpenId = app.globalData.CustomerInfo.WXOpenId
  }
  if (app.globalData.FromUserSysNo == 'undefined' || app.globalData.FromUserSysNo == null) { } else {
    data.FromUserSysNo = app.globalData.FromUserSysNo
  }

  //记录来源群
  if (app.globalData.fromOpenGId != null && app.globalData.fromOpenGId.length > 0) {
    data.FromOpenGId = app.globalData.fromOpenGId
  }
  if (app.globalData.CustomerInfo != null && app.globalData.CustomerInfo.SysNo != null) {
    data.UserNo = app.globalData.CustomerInfo.SysNo.toString()
  }

  var sign = getSign(data)
  if (sign != null && sign.length > 0) {
    data.sign = sign
  }

  IsDevelop ? console.log("接口统一通用参数==:::::::::::::::::::::::::::::::==", data) : null
  return data;
}

//接口统一签名
function getSign(data) {
  if (data == null) {
    return null
  }
  var strSign = ""
  strSign += "AppID" + data.AppID
  strSign += "ClientType" + data.ClientType.toString()
  strSign += "NonceStr" + data.NonceStr
  strSign += "TimeStamp" + data.TimeStamp
  if (data.UserNo) {
    strSign += "UserNo" + data.UserNo
  }
  strSign += "Version" + data.Version
  strSign += RequestKey
  return md5.hexMD5(strSign.toLocaleLowerCase())
}


function getUrl(key) {
  if (IsDevelop) {
    return httpTestUrl + key;
  }
  return httpUrl + key;
}

function showToast(message, showType = 1) {
  if (message == null || message.length == 0) {
    return
  }
  //成功
  if (showType == 1) {
    wx.showToast({
      title: message,
      icon: 'success',
    })
    return
  }
  //等待
  if (showType == 0) {
    wx.showToast({
      title: message,
      icon: 'loading',
    })
    return
  }
  //失败
  if (showType == -1) {
    wx.showToast({
      title: message,
      //icon: 'success',
      icon: 'none',
      //image:'/image/personal_lose.png',
    })
    return
  }
}

module.exports = {
  initApp: initApp,
  requestGet: requestGet,
  requestPost: requestPost,
  uploadFile: uploadFile,
  getRequestDefaultData: getRequestDefaultData,
}