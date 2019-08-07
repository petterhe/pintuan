// pages/salesreport/salesreport.js
import Notify from '../../zanui/dist/notify/notify.js'

var app = getApp()
const api = require('../../utils/api.js')
const method = require('../../utils/method.js')
const request = require('../../utils/request.js')
const appenum = require('../../utils/appenum.js')
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    contentHeight: 0,
    currentTab: '0',

    currentYear: '',
    currentMonth: '',

    month: '选月份',
    nowDateYearMonth: '',
    lastYearDateYearMonth: '',

    changedateleftorright: '',
    customleftdate: '',
    customrightdate: '',
    //是否显示自定义选择框
    showCustomView: false,
    isCalendarShow: false,

    PartnerSales: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    //view初始化
    var contentHeight = that.getContentHeight()

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = method.getFirstAndLastDay(year.toString(), month.toString())

    var nowDateYearMonth = method.getNowDateYearMonth()
    var lastYearDateYearMonth = method.getLastDateYearMonth() + '-01'

    that.setData({
      month: nowDateYearMonth,
      nowDateYearMonth: date[1],
      lastYearDateYearMonth: lastYearDateYearMonth,
      customleftdate: date[0],
      customrightdate: date[1],
      contentHeight: contentHeight,
    })
    //不需要清除月份
    var clearMonth = false
    that.getPartnerSalesService(clearMonth)
  },
  //计算有效显示区域的高度
  getContentHeight: function () {
    var ipxBottomHeight = that.data.isIpx ? 68 : 0
    var windowHeight = app.globalData.systemInfo.windowHeight
    var contentHeight = windowHeight * (750 / app.globalData.systemInfo.windowWidth) - ipxBottomHeight - 78 - 70 - 70
    return contentHeight
  },

  //顶部tab切换函数
  switchNav: function (e) {
    var index = e.currentTarget.dataset.current;
    if (that.data.currentTab == index && that.data.showCustomView) {
      return false;
    } else {
      that.setData({
        currentTab: index,
        showCustomView: index == '1'
      })
    }
  },

  clickContent: function () {
    that.setData({
      showCustomView: false
    })
  },
  //选择月份
  bindPickerChange: function (e) {
    var chooseDate = e.detail.value
    var dateArray = chooseDate.split("-")
    var date = method.getFirstAndLastDay(dateArray[0], dateArray[1])

    that.setData({
      month: chooseDate,
      customleftdate: date[0],
      customrightdate: date[1],
    })
    //不需要清除月份
    var clearMonth = false
    that.getPartnerSalesService(clearMonth)
  },
  //自定义选择 区间日期
  customPickerChange: function (e) {
    var witchDate = e.currentTarget.dataset.key
    if (witchDate == 'left') {
      that.setData({
        customleftdate: e.detail.value,
      })
    } else {
      that.setData({
        customrightdate: e.detail.value,
      })
    }
  },
  //搜索
  searchsalesreport: function () {
    //需要清除月份
    var clearMonth = true
    that.getPartnerSalesService(clearMonth)

    that.setData({
      showCustomView: false
    })
  },

  getPartnerSalesService: function (clearMonth) {
    var _param = {
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      DateFrom: that.data.customleftdate,
      DateTo: that.data.customrightdate,
      ReportType: appenum.PartnerSalesReportType.Group_Partner_Date.Value
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var list = res.data.Entity.listDetail
          for (var key in list) {
            var data = list[key]
            var dateStr = data.OrderDate
            dateStr = dateStr.substring(2)
            data.subOrderDate = dateStr
          }
          that.setData({
            PartnerSales: res.data.Entity,
          })
        } else {
          that.setData({
            PartnerSales: null,
          })
        }
        if (clearMonth) {
          that.setData({
            month: '选月份',
          })
        }
      } else {
        notify(res.data.ResponseStatus.Message)
        that.setData({
          showCustomView: true
        })
      }

    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetPartnerSalesService, _param, _success, _fail, null)
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