// pages/order/order.js
import Notify from '../../zanui/dist/notify/notify.js'
var app = getApp()
const api = require('../../utils/api.js')
const request = require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    tabsMore: ["我发起的团购", "我参与的团购"],
    scrollHeight: app.globalData.systemInfo.windowHeight - 45,
    grouplist: null, //我发起的团
    joinlist: null, //我参与的团

    // 用于控制当 scroll-view 滚动到底部时，显示 “数据加载中...” 的提示
    hidden: true,
    //数据是否正在加载中，避免用户瞬间多次下滑到底部，发生多次数据加载事件
    loadingData: false,
    lastPage: false, //是否是最后一页
    curPage: 1, //当前页
    pageSize: 10, //页记录数

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //我分享的团
    this.getPartnerGroupListService(this.data.curPage)
    //我参与的团
    this.getCusGroupListService()

    var ipxHeight = this.data.isIpx ? 45 : 0
    var scrollHeight = app.globalData.systemInfo.windowHeight - 45 - ipxHeight
    this.setData({
      scrollHeight: scrollHeight,
    })
  },
  //我分享的团
  getPartnerGroupListService: function (curPage) {
    var that = this
    var _param = {
      PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
      pageSize: that.data.pageSize,
      curPage: curPage,
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var list = res.data.Entity
          var grouplist = that.data.grouplist
          if (grouplist == null) {
            grouplist = list
            that.setData({
              grouplist: grouplist
            })
          } else {
            var len = that.data.grouplist.length
            for (var i = 0; i < list.length; i++) {
              var index = len + i
              var productAdd = 'grouplist[' + index + ']'

              that.setData({
                [productAdd]: list[i],
                hidden: true,
                loadingData: false,
              });
            }
          }
          if (list.length < that.data.pageSize) {
            that.data.lastPage = true
          } else {
            that.data.lastPage = false
          }
          that.data.curPage++
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetPartnerGroupListService, _param, _success, _fail, null)
  },
  //我参与的团
  getCusGroupListService: function () {
    var that = this
    var _param = {
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var list = res.data.Entity
          that.setData({
            joinlist: list,
          });
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetCusGroupListService, _param, _success, _fail, null)
  },

  onChange: function (event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  //跳转到订单详情
  navigateDetail: function (e) {
    console.log("跳转到订单详情", e)
    var PlanSysNo = e.currentTarget.dataset.plansysno
    wx.navigateTo({
      url: '../orderdetail/orderdetail?PlanSysNo=' + PlanSysNo,
    })
  },
  //跳转到团详情
  clickToGroupDetail: function (e) {
    console.log("跳转到团购详情", e, e.currentTarget.dataset.plansysno)
    var PlanSysNo = e.currentTarget.dataset.plansysno
    wx.navigateTo({
      url: '../groupdetail/groupdetail?PlanSysNo=' + PlanSysNo,
    })
  },

  //到货确认
  confirmreceipt: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var grouplist = that.data.grouplist
    wx.showModal({
      title: '温馨提示',
      content: '确认您已经收到货了吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认中...',
          })
          var planSysNo = e.currentTarget.dataset.plansysno
          var _param = {
            PartnerSysNo: app.globalData.CustomerInfo.PartnerSysNo, //团长编号
            PlanSysNo: planSysNo
          }
          var _success = function (res) {
            if (res.data.ResponseStatus.ErrorCode == 0) {
              if (res.data != null && res.data.Entity != null) {
                var grouplist = that.data.grouplist
                grouplist[index] = res.data.Entity
                that.setData({
                  grouplist: grouplist
                })
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
          request.requestPost(api.PartnerReceiveOrderService, _param, _success, _fail, _complete)
        } else if (res.cancel) {

        }
      }
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
            console.log("hjhjhhj----取消订单=11166666=", res.data.Entity)
            if (res.data.ResponseStatus.ErrorCode == 0) {
              if (res.data != null && res.data.Entity != null) {
                //我参与的团
                that.getCusGroupListService()
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
          request.requestPost(api.CancelOrderService, _param, _success, _fail, _complete)
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
      console.log("hjhjhhj----订单签收=11166666=", res.data)
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          //我参与的团
          that.getCusGroupListService()
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
    request.requestPost(api.CustomerReceiveOrderService, _param, _success, _fail, _complete)
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

  /**
   * 上滑加载更多
   */
  scrollToLower: function (e) {

    var hidden = this.data.hidden
    var loadingData = this.data.loadingData
    var lastPage = this.data.lastPage
    var that = this
    if (hidden) {
      if (!lastPage) {
        this.setData({
          hidden: false
        });
      }
    }
    if (loadingData) {
      return;
    }
    this.setData({
      loadingData: true
    });

    //我分享的团
    this.getPartnerGroupListService(this.data.curPage)
  },
  // scrollToUpper: function(e) {
  //   wx.showToast({
  //     title: '触顶了...',
  //   })
  // },
  bindscroll: function (e) {

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