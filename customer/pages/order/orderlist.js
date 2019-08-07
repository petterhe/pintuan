var app = getApp()
var that

const api = require('../../utils/api.js')
const method = require('../../utils/method.js')
const request = require('../../utils/request.js')

var orderlist
const pageSize = 20
var currentPage
var bmore = true
var bmoretoast = true

//是否显示加载效果 页面第一次可见显示 刷新时显示   加载更多时不显示
var showLoading = true
var yesterdaydate
var todayDate
var todayDateObj

var strCreateDate
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: null,
    // bottomValue: 0, //列表距离底部的高度
    isIphoneX: app.globalData.isIpx, //是否是x系列的手机
    scrollHeight: 0,
    boxHeight: 0,
    tabIndex: 0,

    //是否显示自定义选择框
    showCustomView: false,
    isCalendarShow: false,
    currentDate: '', //日历控件顶部日期
    currentObj: '',//用户选中的dateObj
    selectDate: '', //用户选中日期
    currentDayList: '',
    tab3_title: '自定义'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    orderlist = null
    //view初始化
    this.initViewLayout()
    var date1 = new Date()
    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(); //time1表示当前时间
    var date2 = new Date(date1);
    //明日的日期
    date2.setDate(date1.getDate() - 1);
    var currentObj = method.getFromatDate(time1)
    todayDateObj = currentObj
    yesterdaydate = date2.getFullYear() + '-' + that.withData((date2.getMonth() + 1)) + '-' + that.withData(date2.getDate())
    //今日的日期
    todayDate = currentObj.getFullYear() + '-' + that.withData((currentObj.getMonth() + 1)) + '-' + that.withData(currentObj.getDate())
    strCreateDate = todayDate

    that.setData({
      currentDate: todayDate,
      currentObj: currentObj,
    })
    refreshDataList()
  },


  //初始化scrollview高度 及iphonex适配
  initViewLayout: function () {
    let mscrollheight
    let pxTorpxScale = app.globalData.systemInfo.windowWidth / 750
    if (app.globalData.isIpx) {
      mscrollheight = app.globalData.systemInfo.windowHeight - (80 + 68) * pxTorpxScale
    } else {
      mscrollheight = app.globalData.systemInfo.windowHeight - 80 * pxTorpxScale
    }
    var boxHeight = that.data.isIpx ? 720 : 640
    that.setData({
      scrollHeight: mscrollheight, //scrollview的高度
      boxHeight: boxHeight
    })


  },
  //点击顶部tab切换
  changeTab: function (e) {
    var index = e.currentTarget.dataset.index
    that.setData({
      tabIndex: Number(index)
    })
    switch (index) {
      case '0':
        that.setData({
          tab3_title: '自定义'
        })
        strCreateDate = todayDate
        refreshDataList()
        break;
      case '1':
        that.setData({
          tab3_title: '自定义'
        })
        strCreateDate = yesterdaydate
        refreshDataList()
        break;
      case '2':
        that.setData({
          currentDate: todayDate
        })
        that.showCalendar()
        break;
    }

  },

  //点击自定义时间选择框 显示日历
  showCalendar: function (e) {
    var currentObj
    var currentDate
    var selectDate
    currentDate = that.data.currentDate
    selectDate = currentDate.trim()
    currentObj = method.getFromatDate(currentDate)
    that.setData({
      isCalendarShow: true,
      currentDate: currentDate,
      currentObj: currentObj,
      selectDate: selectDate,

    });

    that.setSchedule(currentObj)
  },
  //点击页面  隐藏日历
  hideCalendar: function () {
    that.setData({
      isCalendarShow: false,
    });
  },

  //点击页面 隐藏自定义选择控件
  clickContent: function () {
    that.setData({
      showCustomView: false
    })
  },
  //点击日历上得箭头  切换上月或者下月
  doDay: function (e) {
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = currentObj.getDate();
    var str = ''
    if (e.currentTarget.dataset.key == 'left') {
      m -= 1
      if (m <= 0) {
        str = (Y - 1) + '-' + 12 + '-' + d
      } else {
        str = Y + '-' + m + '-' + d
      }
    } else {
      m += 1
      if (m <= 12) {
        str = Y + '-' + m + '-' + d
      } else {
        str = (Y + 1) + '-' + 1 + '-' + d
      }
    }
    currentObj = method.getFromatDate(str)
    that.setData({
      currentDate: currentObj.getFullYear() + '-' + that.withData((currentObj.getMonth() + 1)) + '-' + that.withData(currentObj.getDate()),
      currentObj: currentObj
    })
    that.setSchedule(currentObj);

  },
  //点击日历日期
  onCalendarDayTap: function (e) {
    var day = e.currentTarget.dataset.day
    if (day.length == 0) {
      return
    }
    var currentObj = that.data.currentObj
    var Y = currentObj.getFullYear();
    var m = currentObj.getMonth() + 1;
    var d = day;
    var currentDate = Y + '-' + that.withData(m) + '-' + that.withData(d)
    currentObj = method.getFromatDate(currentDate)
    // var tab3_title = Y + '-' + m + '-' + d
    var tab3_title = currentDate
    that.setData({
      isCalendarShow: false,
      currentDate: currentDate,
      currentObj: currentObj,
      tab3_title: tab3_title
    })
    //设置第三个tab的title的文字
    strCreateDate = currentDate
    refreshDataList()
  },

  //设置日历控件
  setSchedule: function (currentObj) {
    var m = currentObj.getMonth() + 1
    var Y = currentObj.getFullYear()
    var d = currentObj.getDate();
    var dayString = Y + '-' + m + '-' + currentObj.getDate()
    var currentDayNum = new Date(Y, m, 0).getDate()
    var currentDayWeek = currentObj.getUTCDay() + 1
    var result = currentDayWeek - (d % 7 - 1);
    var firstKey = result <= 0 ? 7 + result : result;
    var currentDayList = []
    var f = 0
    for (var i = 0; i < 42; i++) {
      var data = {}
      if (i < firstKey - 1) {
        currentDayList[i] = data
      } else {
        if (f < currentDayNum) {
          data.day = f + 1
          data.date = (Y + '-' + that.withData(m) + '-' + that.withData(data.day)).trim()
          currentDayList.push(data)
          f = currentDayList[i].day
        } else if (f >= currentDayNum) {
          currentDayList[i] = data
        }
      }
    }
    that.setData({
      currentDayList: currentDayList
    })
  },

  //如果小于10 自动补0
  withData: function (param) {
    return param < 10 ? '0' + param : '' + param;
  },


  /**
   * 上滑加载更多
   */
  scrollToLower: function (e) {
    if (!bmore) {
      if (bmoretoast) {
        showToastView('已经是最后一页', -1);
        bmoretoast = false
      }
      return
    }
    loadmore()
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
  clicktocall:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },

  //显示订单数据
  setOrderList: function (list) {
    if (orderlist == null) {
      orderlist = list
      that.setData({
        orderlist: orderlist
      })
    }
    else {
      var len = that.data.orderlist.length
      for (var i = 0; i < list.length; i++) {
        var index = len + i
        var ordertAdd = 'orderlist[' + index + ']'
        that.setData({
          [ordertAdd]: list[i]
        });
      }
    }
    if (list.length < pageSize) {
      bmore = false;
    }
  },
  /**
  * 获取订单列表数据
  */
  requestOrderData: function () {
    var data = {};
    data.StrCreateDate = strCreateDate
    data.PartnerSysNo = app.globalData.CustomerInfo.PartnerSysNo //团长编号
    data.pageSize = pageSize
    data.curPage = currentPage
    var _success = function (res) {
      if (res.data != null && res.data.Entity != null && res.data.Entity.length > 0) {
        that.setOrderList(res.data.Entity)
        return
      }

      if (res.data.ResponseStatus && res.data.ResponseStatus.Message) {
        method.showToast(res.data.ResponseStatus.Message, -1)
      }

    }
    var _fail = function (res) {
      method.showToast("服务器请求失败", -1);
    }
    request.requestGet(api.GetOrderListService, data, _success, _fail, null)
  },
})


/**
 * 加载更多
 */
function loadmore() {
  showLoading = false
  currentPage++
  that.requestOrderData()
}

/**
 * 刷新数据
 */
function refreshDataList() {
  showLoading = true
  clearData()
  that.requestOrderData()

}

/**
 * 清空页面数据
 */
function clearData() {
  currentPage = 1
  bmore = true
  bmoretoast = true
  orderlist = null
  that.setData({
    orderlist: orderlist
  })

}
function showToastView(toastMessage, showType = 1) {
  that.setData({
    isShowToast: true,
    toastMessage: toastMessage,
  })

  setTimeout(hideToastView, 2000);
}

function hideToastView() {
  that.setData({
    isShowToast: false,
    toastMessage: '',
  })
}