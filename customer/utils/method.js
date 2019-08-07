var app = getApp()

//初始化
function initApp(that) {
  if (app == null) {
    app = that
    getSystemInfo()
    getNetworkType()
  }
}

//获取系统信息
function getSystemInfo() {
  var systemInfo = wx.getSystemInfoSync()
  app.globalData.systemInfo = systemInfo;
  var phoneModelStr = app.globalData.systemInfo.model.toString()
  // iPhone X iPhone XS iPhone XR
  if (phoneModelStr.indexOf("iPhone X") != -1 || phoneModelStr.indexOf("iPhone XS") != -1 || phoneModelStr.indexOf("iPhone XR") != -1) {
    app.globalData.isIpx = true
  }
}
//获取网络状态 网络类型2g，3g，4g，wifi
function getNetworkType(that) {
  var networkType
  wx.getNetworkType({
    success: function (res) {
      app.globalData.networkType = res.networkType
    }
  })
}

//生成随机数
function newGuid() {
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

//获取时间戳
function getNowTimeSpan() {
  return new Date().getTime().toString()
}

//验证手机号
function validateTellPhone(tel) {
  var TEL_REGEXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
  if (TEL_REGEXP.test(tel)) {
    return true;
  }
  return false;
}

//验证身份证号码
function checkIDCard(idcode) {
  // 加权因子
  var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验码
  var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  var code = idcode + "";
  var last = idcode[17]; //最后一个
  var seventeen = code.substring(0, 17);
  // ISO 7064:1983.MOD 11-2
  // 判断最后一位校验码是否正确
  var arr = seventeen.split("");
  var len = arr.length;
  var num = 0;
  for (var i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i];
  }
  // 获取余数
  var resisue = num % 11;
  var last_no = check_code[resisue];
  // 正则思路
  /*
     第一位不可能是0
     第二位到第六位可以是0-9
     第七位到第十位是年份，所以七八位为19或者20
     十一位和十二位是月份，这两位是01-12之间的数值
     十三位和十四位是日期，是从01-31之间的数值
     十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
     */
  var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
  // 判断格式是否正确
  var format = idcard_patter.test(idcode);
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  return last === last_no && format ? true : false;
}

function getSharePath(path) {
  if (path.indexOf('?') >= 0) {
    path = path + '&'
  } else {
    path = path + '?'
  }
  return path + 'FromUserSysNo=' + app.globalData.CustomerInfo.SysNo
}

function getShareScenePath(scene) {
  var path = "pages/usercenter/usercenter?scene=" + scene + "," +
    app.globalData.CustomerInfo.SysNo
  return path
}

//根据key 获取项目配置 对应内容
function getSysDataConfigValue(key) {
  if (app.globalData.sysDataConfig == null || app.globalData.sysDataConfig.length == 0) {
    return ''
  }
  for (var i = 0; i < app.globalData.sysDataConfig.length; i++) {
    var config = app.globalData.sysDataConfig[i]
    if (config != null && config.ConfigType.toLowerCase() == key.toLowerCase()) {
      return config.Value
    }
  }
}

//获取随机颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

//获取一个月 前 的日期  年月日
function getThirdyDate() {
  var datenow = new Date()
  var dateago = new Date(datenow)
  dateago.setDate(datenow.getDate() - 30)
  var month = dateago.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }

  var day = dateago.getDate()
  if (day >= 1 && day <= 9) {
    day = "0" + day;
  }
  return (dateago.getFullYear() + "-" + month + "-" + day).toString()
}
//获取 当前 的日期  年月日
function getNowDate() {
  var datenow = new Date()
  var month = datenow.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  var day = datenow.getDate()
  day = day < 10 ? '0' + day : day
  return (datenow.getFullYear() + "-" + month + "-" + day).toString()
}

//获取 当前 的日期  年月
function getNowDateYearMonth() {
  var datenow = new Date()
  var month = datenow.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  return (datenow.getFullYear() + "-" + month).toString()
}
//获取 一年前 的日期  年月
function getLastDateYearMonth() {
  var datenow = new Date()
  var month = datenow.getMonth() + 1
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  return (datenow.getFullYear() - 1 + "-" + month).toString()
}

//获取当前月份的第一天和最后一天
function getFirstAndLastDay(year, month) {
  let strLink = "-";
  if (month.length == 1) {
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
  }
  let lastDay = getLastDay(year, month);
  let firstDate = year + strLink + month + strLink + '01';
  let lastDate = year + strLink + month + strLink + lastDay;
  let returnArr = [firstDate, lastDate]; //以数组形式返回
  return returnArr;
}
/**
 * 获取当月的最后一天
 * @param year 年份
 * @param month 月份
 **/
function getLastDay(year, month) {

  let now = new Date();
  let nowyear = now.getFullYear();
  let nowmonth = now.getMonth() + 1;
  if (nowyear == year && nowmonth == month) {
    var day = now.getDate()
    if (day >= 1 && day <= 9) {
      day = "0" + day;
    }
    return day;
  } else {
    let new_year = year;
    let new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
    if (month > 12) { //如果当前大于12月，则年份转到下一年
      new_month -= 12; //月份减
      new_year++; //年份增
    }
    // 取当年当月对应的下个月的前一天，即当前月的最后一天
    let last_date = new Date(new_year, new_month, 0).getDate();
    return last_date;
  }
}

/**
 * 年月日转date （用于ios兼容）
 */
function getFromatDate(dateStr) {
  var arr = dateStr.split(/[- : \/]/)
  return new Date(arr[0], arr[1] - 1, arr[2])
}

//获取用户地理位置权限
function getPermission(obj, callBack) {
  wx.chooseLocation({
    success: function (res) {
      obj.setData({
        storePlacemarks: res.name,
        storeAddress: res.address,
        storeAllAddress: res.name,
        // storeAllAddress: res.name + '\n' + res.address,
        latitude: res.latitude,
        longitude: res.longitude
      })
      callBack(res)
    },
    fail(res) {
      wx.getSetting({
        success: function (res) {
          var statu = res.authSetting;
          if (!statu['scope.userLocation']) {
            wx.showModal({
              title: '是否授权当前位置',
              content: app.globalData.miniAppName + '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
              success: function (tip) {
                if (tip.confirm) {
                  wx.openSetting({
                    success: function (data) {
                      if (data.authSetting["scope.userLocation"] === true) {
                        wx.showToast({
                          title: '授权成功',
                          icon: 'success',
                          duration: 1000
                        })
                        //授权成功之后，再调用chooseLocation选择地方
                        wx.chooseLocation({
                          success: function (res) {
                            obj.setData({
                              storePlacemarks: res.name,
                              storeAddress: res.address,
                              storeAllAddress: res.name,
                              // storeAllAddress: res.name + '\n' + res.address,
                              latitude: res.latitude,
                              longitude: res.longitude
                            })
                            callBack(res)
                          },
                        })
                      } else {
                        wx.showToast({
                          title: '授权失败',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '调用授权窗口失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    },
  })
}

//弹出吐司的方法
function showToast(message, showType = 1) {
  if (message == null || message.length == 0) {
    return
  }
  //成功
  if (showType == 1) {
    wx.showToast({
      title: message,
      icon: 'success',
      duration: 2000
    })
    return
  }
  //等待
  if (showType == 0) {
    wx.showToast({
      title: message,
      icon: 'loading',
      duration: 2000
    })
    return
  }
  //失败
  if (showType == -1) {
    wx.showToast({
      title: message,
      //icon: 'success',
      icon: 'none',
      duration: 2000
      //image:'/image/personal_lose.png',
    })
    return
  }
}

//设置分享
function showShareMenu() {
  if (wx.showShareMenu) {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
}


module.exports = {
  initApp: initApp,
  newGuid: newGuid,
  showToast: showToast,
  getNowTimeSpan: getNowTimeSpan,
  checkIDCard: checkIDCard,
  validateTellPhone: validateTellPhone,
  getSharePath: getSharePath,
  getSysDataConfigValue: getSysDataConfigValue,
  getPermission: getPermission,
  getRandomColor: getRandomColor,
  getThirdyDate: getThirdyDate,
  getNowDate: getNowDate,
  getNowDateYearMonth: getNowDateYearMonth,
  getLastDateYearMonth: getLastDateYearMonth,
  getFirstAndLastDay: getFirstAndLastDay,
  getFromatDate: getFromatDate,
  getShareScenePath: getShareScenePath,
  showShareMenu: showShareMenu,
}