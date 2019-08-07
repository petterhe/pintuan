// pages/groupdetail/groupdetail.js
import Notify from '../../zanui/dist/notify/notify.js'
var app = getApp()
const api = require('../../utils/api.js')
const appenum = require('../../utils/appenum.js')
const request = require('../../utils/request.js')
const method = require('../../utils/method.js')
const login = require('../../utils/applogin.js')

var that
var doomtimer //弹幕定时器

var PartnerSysNo
var PlanSysNo
var FromUserSysNo
var CustomerSysNo
var shareBuyInfo
var shareImage
var confirmDistinct = 0 // 超距离强制下单标志

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    bottom: '90rpx',
    formId: '',
    countdown: '',
    endDate: '',
    allProductPrice: 0,
    allBuyQty: 0,
    loading: false,
    disable: false,
    hasUserInfo: false,
    GroupDetailData: null, //团购详情数据
    ListGroupProduct: null, //商品列表
    orderlist: null, //订单列表
    CustomerInfo: null, //登录成功后用户信息数据
    PartnerInfo: null, //团长信息

    buyProductList: [], //加入购物车的商品

    hideModal: true, //商品大图&详情状态 true-隐藏 false-显示 
    hideCartModal: true, //购物车数据 true-隐藏 false-显示 
    animationData: {}, //

    showModal: false, //温馨提示是否显示
    showImage: false, //团分享朋友圈是否显示
    shareImageUrl: '',

    firstProduct: null, //支付成功后的第一个商品
    showShareModel: false, //是否展示支付成功后的分享弹框

    saveImgBtnHidden: false,
    openSettingBtnHidden: true,

    doommData: [], //弹幕数据
    chooseProductDetail: null, //商品详情选中的商品

    sectionHeaderLocationTop: 0,
    //页面滚动距离
    scrollTop: 0,
    //是否悬停
    fixed: false,
    //置顶按钮是否隐藏
    totopHidden: true,

    scrollLeft: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //设置分享
    method.showShareMenu()
    shareBuyInfo = null
    shareImage = null

    console.log("groupdetail========", options, options.PartnerSysNo)

    //隔天 清除本地购物车缓存数据
    var nowDateStorage = wx.getStorageSync('nowDateStorage')
    var nowDate = method.getNowDate()
    if (nowDate == nowDateStorage) {
      var buyProductList = wx.getStorageSync('buylist')
      if (buyProductList) {
        that.setData({
          buyProductList: buyProductList
        })
      }
    } else {
      wx.setStorageSync('nowDateStorage', nowDate)
      wx.removeStorage({
        key: 'buylist',
        success(res) {
          that.setData({
            buyProductList: []
          })
        }
      })
    }
    that.statisticsProduct()

    PlanSysNo = options.PlanSysNo
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
    that.refreshUserInfoData()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    //获取拼团中列表
    this.getGetGroupingListService()

    // //获取团详情
    // this.getGroupDetailService()
    // //获取团详情订单
    // this.getGroupDetailOrderService()

    wx.stopPullDownRefresh()
  },

  onShow: function () {

  },
  onUnload: function () {
    clearTimeout(doomtimer) //销毁弹幕定时器
  },
  /**
   * 页面加载完成
   */
  onReady: function () {
    var topHeight = 90 / (750 / app.globalData.systemInfo.windowWidth)
    that.setData({
      sectionHeaderLocationTop: topHeight + that.data.scrollTop
    })
  },
  /**
   * 页面滚动监听
   */
  onPageScroll: function (e) {
    // console.log(e)
    that.data.scrollTop = e.scrollTop;
    if (e.scrollTop > that.data.sectionHeaderLocationTop) {
      that.setData({
        fixed: true
      })
    } else {
      that.setData({
        fixed: false
      })
    }
    var toTopHeight = 970 / (750 / app.globalData.systemInfo.windowWidth)
    if (e.scrollTop > toTopHeight) {
      that.setData({
        totopHidden: false
      })
    } else {
      that.setData({
        totopHidden: true
      })
    }
  },

  //递归刷新数据
  refreshPageData: function () {

    // if (app.globalData.CustomerInfo == null) {
    //   setTimeout(function() {
    //     that.refreshPageData()
    //   }, 1000)
    //   return
    // }

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
    } else {
      //团长信息置空
      app.globalData.PartnerInfo = null
    }

    //团长信息为空 需要先获取团长信息
    if (app.globalData.PartnerInfo == null) {
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
                  if (app.globalData.CustomerInfo.CustomerType == 1) { //团长
                    wx.redirectTo({
                      url: '../../pages/home/home',
                    })
                  } else { //用户
                    wx.redirectTo({
                      url: '../../pages/usercenter/usercenter',
                    })
                  }
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

    //获取分享图片
    getShareImage()
  },

  getDetailMessage: function () {

    //获取拼团中列表
    that.getGetGroupingListService()

    // //获取团详情
    // that.getGroupDetailService()
    // //获取团详情订单
    // that.getGroupDetailOrderService()

    that.setData({
      CustomerInfo: app.globalData.CustomerInfo,
      PartnerInfo: app.globalData.PartnerInfo
    })
  },

  //刷新授权
  refreshUserInfoData: function () {

    if (app.globalData.userInfo == null) {
      setTimeout(function () {
        that.refreshUserInfoData()
      }, 500)
    } else {
      that.setData({
        hasUserInfo: true,
      })
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


          var groupingList = res.data.Entity
          var newBuyProductList = []
          var buyProductList = that.data.buyProductList

          for (var i = 0; i < groupingList.length; i++) {
            var iteming = groupingList[i]
            for (var j = 0; j < buyProductList.length; j++) {
              var product = buyProductList[j]
              if (iteming.PlanSysNo == product.PlanSysNo) {
                newBuyProductList.push(product)
              }
            }
          }
          //获取团详情
          that.getGroupDetailService()
          //获取团详情订单
          that.getGroupDetailOrderService()

          var planSysNo = PlanSysNo
          var groupingList = res.data.Entity
          for (var i = 0; i < groupingList.length; i++) {
            var item = groupingList[i]
            if (parseInt(planSysNo) == item.PlanSysNo) {
              item.select = true
            } else {
              item.select = false
            }
          }

          // groupingList.splice(0,2)
          that.setData({
            buyProductList: newBuyProductList,
            GroupingList: groupingList,
          });
          that.statisticsProduct()

          //滚动到对应的planSysNo
          that.handleScroll(PlanSysNo);
        }
      } else {
        // notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGroupingListService, _param, _success, _fail, null)
  },

  //获取团详情
  getGroupDetailService: function () {

    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      PartnerSysNo: PartnerSysNo, //团长编号
      PlanSysNo: PlanSysNo, //计划号
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          var listGroupProduct = res.data.Entity.ListGroupProduct
          var buyProductList = that.data.buyProductList
          for (var i = 0; i < listGroupProduct.length; i++) {
            var item = listGroupProduct[i]
            item.BuyQty = 0
            item.GroupName = res.data.Entity.GroupName

            if (buyProductList.length > 0) {
              for (var j = 0; j < buyProductList.length; j++) {
                var product = buyProductList[j]
                if (item.ProductSysNo == product.ProductSysNo) {
                  if (item.PlanSysNo == product.PlanSysNo) {
                    item.BuyQty = product.BuyQty
                  }
                }
              }
            } else {
              item.BuyQty = 0
            }
            // 只有大于一件的时候，才能normal状态，否则disable状态  
            var minusStatus = item.BuyQty <= 0 ? 'disabled' : 'normal';
            item.minusStatus = minusStatus
          }
          that.setData({
            GroupDetailData: res.data.Entity,
            ListGroupProduct: listGroupProduct,
          });

          //倒计时
          that.data.endDate = res.data.Entity.StrEndTime
          that.countTime()
        } else {
          var groupingList = that.data.GroupingList
          if (groupingList.length > 0) {
            var itemGroup = groupingList[0]
            var plansysno = itemGroup.PlanSysNo
            PlanSysNo = plansysno
            //获取分享图片
            getShareImage()

            for (var i = 0; i < groupingList.length; i++) {
              var item = groupingList[i]
              if (parseInt(plansysno) == item.PlanSysNo) {
                item.select = true
              } else {
                item.select = false
              }
            }
            that.setData({
              GroupingList: groupingList,
            });

            //获取团详情
            that.getGroupDetailService()
            //获取团详情订单
            that.getGroupDetailOrderService()
          }
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGroupDetailService, _param, _success, _fail, null)
  },
  //获取团详情订单列表
  getGroupDetailOrderService: function () {

    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      PartnerSysNo: PartnerSysNo, //团长编号
      PlanSysNo: PlanSysNo, //计划号
    }
    var _success = function (res) {
      var bottom
      if (res.data.ResponseStatus.ErrorCode == 0) {

        if (res.data != null && res.data.Entity != null) {
          bottom = '0rpx'
          that.setData({
            orderlist: res.data.Entity,
            bottom: bottom,
          });

          //处理弹幕数据
          that.dealDoommData()
        } else {
          bottom = '0rpx'
          // bottom = that.data.isIpx ? '158rpx' : '90rpx'
          that.setData({
            orderlist: [],
            bottom: bottom,
          });
        }
      } else {
        bottom = '0rpx'
        // bottom = that.data.isIpx ? '158rpx' : '90rpx'
        that.setData({
          orderlist: [],
          bottom: bottom,
        });
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {
      var bottom = '0rpx'
      // var bottom = that.data.isIpx ? '158rpx' : '90rpx'
      that.setData({
        orderlist: [],
        bottom: bottom,
      });
    }
    request.requestGet(api.GetGroupDetailOrderService, _param, _success, _fail, null)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    //获取分享术语
    var title
    var imageurl
    if (shareImage) {
      title = method.getSysDataConfigValue("PlanDetailShareTips")
      if (title.indexOf("{0}") >= 0) {
        title = title.replace("{0}", that.data.GroupDetailData.GroupName)
      }
      imageurl = shareImage
    } else {
      title = that.data.GroupDetailData.GroupName
      imageurl = that.data.GroupDetailData.ImageUrl
    }
    // var path = 'pages/groupdetail/groupdetail?PartnerSysNo=' + PartnerSysNo + '&PlanSysNo=' + PlanSysNo
    // path = method.getSharePath(path)
    // console.log(path)

    var scene = appenum.SharePageType.PlanDetail.Value + "," + PartnerSysNo + "," + PlanSysNo
    var path = method.getShareScenePath(scene)
    console.log('分享集中处理path==团详情======', path)
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
  //倒计时
  countTime: function () {
    var date = new Date();
    var now = date.getTime();
    var arr = that.data.endDate.split(/[- : \/]/);
    var endDate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    // var endDate = new Date(that.data.endDate); //设置截止时间
    var end = endDate.getTime();
    var leftTime = end - now; //时间差     

    var d, h, m, s;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
      m = Math.floor(leftTime / 1000 / 60 % 60);
      s = Math.floor(leftTime / 1000 % 60);
      s = s < 10 ? "0" + s : s
      m = m < 10 ? "0" + m : m
      h = h < 10 ? "0" + h : h
      if (d > 0) {
        that.setData({
          countdown: "距结团还剩\n" + d + "天" + h + ":" + m + ":" + s,
        })
      } else {
        that.setData({
          countdown: "距结团还剩\n" + h + ":" + m + ":" + s,
        })
      }
      //递归每秒调用countTime方法，显示动态时间效果
      setTimeout(that.countTime, 1000);
    } else {
      that.setData({
        countdown: '已结束'
      })
    }
  },
  /* 点击减号 */
  bindMinus: function (e) {
    var index = e.currentTarget.dataset.index
    var listGroupProduct = that.data.ListGroupProduct
    var buyProductList = that.data.buyProductList
    var item = listGroupProduct[index]
    // 如果大于1时，才可以减  
    if (item.BuyQty > 0) {

      for (var i = 0; i < buyProductList.length; i++) {
        var product = buyProductList[i]
        if (item.ProductSysNo == product.ProductSysNo) {
          item.BuyQty--;
          buyProductList.splice(i, 1)
          if (item.BuyQty != 0) {
            buyProductList.push(item)
          }
          wx.setStorageSync('buylist', buyProductList)
          break
        }
      }
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = item.BuyQty <= 0 ? 'disabled' : 'normal';
    item.minusStatus = minusStatus

    // 将数值与状态写回  
    this.setData({
      ListGroupProduct: listGroupProduct,
      buyProductList: buyProductList,
    })

    //统计数量和价格
    this.statisticsProduct()
  },
  /* 点击加号 */
  bindPlus: function (e) {
    var index = e.currentTarget.dataset.index
    var listGroupProduct = that.data.ListGroupProduct
    var buyProductList = that.data.buyProductList
    var item = listGroupProduct[index]
    // 结合剩余数量 限购数量判断是否能增加
    if (item.BuyQty < item.OnlineQty) {
      if (item.BuyQty < item.LimitQty) {

        var add = true
        for (var i = 0; i < buyProductList.length; i++) {
          var product = buyProductList[i]
          if (item.ProductSysNo == product.ProductSysNo) {
            item.BuyQty++;
            buyProductList.splice(i, 1)
            buyProductList.push(item)
            wx.setStorageSync('buylist', buyProductList)
            add = false
            break
          }
        }
        if (add) {
          item.BuyQty++;
          buyProductList.push(item)
          wx.setStorageSync('buylist', buyProductList)
        }
        wx.vibrateShort({})
      } else {
        notify(item.ProductName + '\t' + item.LimitTips)
      }
    } else {
      notify(item.ProductName + '\t库存不足')
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = item.BuyQty <= 0 ? 'disabled' : 'normal';
    item.minusStatus = minusStatus
    // 将数值与状态写回  
    this.setData({
      ListGroupProduct: listGroupProduct,
      buyProductList: buyProductList,
    })

    //统计数量和价格
    this.statisticsProduct()
  },
  /* 输入框事件 */
  bindManual: function (e) {

  },
  //弹框购物车减
  bindCartMinus: function (e) {
    var index = e.currentTarget.dataset.index
    that.refreshGroup(index)
    var buyProductList = that.data.buyProductList
    var item = buyProductList[index]
    // 如果大于1时，才可以减  
    if (item.BuyQty > 0) {
      item.BuyQty--;
      if (item.BuyQty == 0) {
        buyProductList.splice(index, 1)
      }
    }
    wx.setStorageSync('buylist', buyProductList)
    // 将数值与状态写回  
    that.setData({
      buyProductList: buyProductList,
    })
    //统计数量和价格
    that.statisticsProduct()
  },
  //弹框购物车加
  bindCartPlus: function (e) {
    var index = e.currentTarget.dataset.index
    that.refreshGroup(index)
    var buyProductList = that.data.buyProductList
    var item = buyProductList[index]
    // 结合剩余数量 限购数量判断是否能增加
    if (item.BuyQty < item.OnlineQty) {
      if (item.BuyQty < item.LimitQty) {
        item.BuyQty++
        wx.vibrateShort({})
      } else {
        notify(item.ProductName + '\t' + item.LimitTips)
      }
    } else {
      notify(item.ProductName + '\t库存不足')
    }

    wx.setStorageSync('buylist', buyProductList)
    // 将数值与状态写回  
    that.setData({
      buyProductList: buyProductList,
    })
    //统计数量和价格
    that.statisticsProduct()
  },

  //统计数量和价格
  statisticsProduct: function () {

    var allBuyQty = 0
    var allProductPrice = 0
    var buyProductList = that.data.buyProductList
    if (buyProductList.length == 0) {
      that.hideCartModal()
    }
    for (var i = 0; i < buyProductList.length; i++) {
      var item = buyProductList[i]
      allBuyQty += item.BuyQty
      var itemPrice = item.BuyQty * item.Price
      allProductPrice += itemPrice
    }
    that.setData({
      allBuyQty: allBuyQty,
      allProductPrice: allProductPrice,
    })
  },
  //是否刷新当前团详情
  refreshGroup: function (index) {
    var buyProductList = that.data.buyProductList
    var buyItem = buyProductList[index]
    var listGroupProduct = that.data.ListGroupProduct
    for (var i = 0; i < listGroupProduct.length; i++) {
      var product = listGroupProduct[i]
      if (buyItem.ProductSysNo == product.ProductSysNo) {
        that.getGroupDetailService()
        break
      }
    }
  },
  //关闭分享弹窗
  closeShareView: function () {
    shareBuyInfo = null
  },

  clicktodetail: function (e) {
    var aid = e.currentTarget.dataset.aid
    if (aid == 1) {

    } else if (aid == 2) {
      const latitude = parseFloat(this.data.PartnerInfo.Latitude)
      const longitude = parseFloat(this.data.PartnerInfo.Longitude)
      wx.openLocation({
        latitude,
        longitude,
        name: this.data.PartnerInfo.Placemarks,
        address: this.data.PartnerInfo.Address,
        scale: 14
      })
    } else if (aid == 3) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.name
      })
    }
  },
  //formId
  formSubmit(e) {
    this.data.formId = e.detail.formId
  },

  //去支付
  clickToBuy: function () {

    var customerPhone = app.globalData.CustomerInfo.CustomerPhone
    if (customerPhone.length > 0) {
      that.submitOrder(customerPhone)
    } else {
      //弹出授权电话号码弹框
      that.setData({
        showModal: true,
      })
    }
  },
  //取消
  getPhoneCancel: function () {
    this.setData({
      showModal: false,
    })
  },
  //给予理解
  getPhoneNumber: function (e) {

    if (e.detail.encryptedData &&
      e.detail.iv) {
      var _param = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        WXOpenId: that.data.CustomerInfo.WXOpenId
      }
      var _success = function (res) {

        if (res.data.ResponseStatus.ErrorCode == 0) {

          var customerPhone = res.data.Entity.purePhoneNumber
          //提交订单
          that.submitOrder(customerPhone)
          //更新用户信息
          login.updateCustomerInfoService(app.globalData.CustomerInfo.SysNo, customerPhone, app.globalData.userInfo.nickName, app.globalData.userInfo.avatarUrl)
        } else {
          notify(res.data.ResponseStatus.Message)
        }

      }
      var _fail = function (res) {
        notify('获取微信手机号失败')
      }
      request.requestGet(api.GetWXPhoneService, _param, _success, _fail, null)
    } else {
      notify('获取微信手机号失败')
    }

    that.setData({
      showModal: false,
    })
  },

  //提交订单
  submitOrder: function (customerPhone) {
    that.setData({
      loading: true,
      disable: true,
    })
    that.hideCartModal()

    var StrDetail = []
    var listBuyProduct = that.data.buyProductList
    for (var i = 0; i < listBuyProduct.length; i++) {
      var item = listBuyProduct[i]
      if (item.BuyQty > 0) {
        var itemParam = {}
        itemParam.ProductSysNo = item.ProductSysNo
        itemParam.BuyQty = item.BuyQty
        itemParam.PlanSysNo = item.PlanSysNo
        itemParam.ProductName = item.ProductName
        itemParam.GroupName = item.GroupName
        StrDetail.push(itemParam)
      }
    }
    //json对象转成json字符串
    var strDetailJSON = JSON.stringify(StrDetail)
    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      PartnerSysNo: PartnerSysNo, //团长编号
      // PlanSysNo: PlanSysNo, //计划号
      ReceivePhone: customerPhone, //收货电话
      ClientType: 1, //
      StrDetail: strDetailJSON,
      FormId: that.data.formId, //FormId
      ConfirmDistinct: confirmDistinct // 超距离强制下单标志
    }
    var _success = function (res) {
      if (res.data.ResponseStatus.ErrorCode == 0) {
        that.getWXCusPayParamsService(res.data.Entity)
      } else if (res.data.ResponseStatus.ErrorCode == 350307) {
        wx.showModal({
          title: '温馨提示',
          content: res.data.ResponseStatus.Message,
          success(res) {
            if (res.confirm) {
              confirmDistinct = 1
              that.clickToBuy()
            } else if (res.cancel) {

            }
          }
        })
      } else {
        notify(res.data.ResponseStatus.Message)
      }
      that.setData({
        loading: false,
        disable: false,
      })
    }
    var _fail = function (res) {
      that.setData({
        loading: false,
        disable: false,
      })
    }
    var _complete = function (res) {
      confirmDistinct = 0
    }
    request.requestPost(api.SubmitOrderShoppingService, _param, _success, _fail, _complete)
  },

  //获取订单支付信息 Get
  getWXCusPayParamsService: function (submitData) {
    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      SOSysNo: submitData.SOSysNo, //订单号
    }
    var _success = function (res) {
      that.setData({
        loading: false
      })
      if (res.data.ResponseStatus.ErrorCode == 0) {
        wx.requestPayment({
          'timeStamp': res.data.Entity.timeStamp,
          'nonceStr': res.data.Entity.nonceStr,
          'package': res.data.Entity.packageValue,
          'signType': 'MD5',
          'paySign': res.data.Entity.sign,
          'success': function (res) {

            //团长信息
            login.getPartnerInfoService(PartnerSysNo, CustomerSysNo, function (res) {
              that.setData({
                PartnerInfo: res
              })
            })
            var listGroupProduct = that.data.buyProductList
            wx.removeStorage({
              key: 'buylist',
              success(res) {
                that.setData({
                  buyProductList: []
                })
                that.statisticsProduct()

                //获取拼团中列表
                that.getGetGroupingListService()

                // var listGroupProduct = that.data.ListGroupProduct
                for (var i = 0; i < listGroupProduct.length; i++) {
                  var item = listGroupProduct[i]
                  if (item.ProductImageUrl.length != 0) {
                    item.ProductImageUrl = encodeURIComponent(item.ProductImageUrl)
                  }
                }
                var listGroupProductJsonStr = JSON.stringify(listGroupProduct)
                wx.navigateTo({
                  url: '../buysuccess/buysuccess?DeliveryCode=' + submitData.DeliveryCode + '&GroupName=' + that.data.GroupDetailData.GroupName + '&listGroupProduct=' + listGroupProductJsonStr + '&PartnerSysNo=' + PartnerSysNo + '&PlanSysNo=' + PlanSysNo + '&StrExpectDeliveryTime=' + submitData.StrExpectDeliveryTime
                })
              }
            })


            // 将数值与状态写回  
            // that.setData({
            //   allProductPrice: 0,
            //   allBuyQty: 0,
            // })

            // notify('支付成功')
          },
          'fail': function (res) {
            notify('支付未完成')
          }
        })
        return
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {
      that.setData({
        loading: false
      })
    }
    request.requestGet(api.GetWXCusPayParamsService, _param, _success, _fail, null)
  },

  //支付成功后弹出购买的第一个商品 分享 弹框
  showBuyProductListShare: function () {

    var listGroupProduct = that.data.ListGroupProduct
    for (var i = 0; i < listGroupProduct.length; i++) {
      var item = listGroupProduct[i]
      if (item.BuyQty != 0) {
        shareBuyInfo = item
        that.setData({
          firstProduct: item,
        })
        break
      }
    }
    that.setData({
      showShareModel: true,
    })
  },

  //打开店铺主页
  openStore: function () {
    var pageArray = getCurrentPages()
    if (app.globalData.CustomerInfo.CustomerType == 1) { //团长
      if (pageArray.length > 1) {
        wx.navigateBack({})
      } else {
        wx.navigateTo({
          url: '../home/home?PartnerSysNo=' + PartnerSysNo + '&CustomerSysNo=' + CustomerSysNo
        })
      }
    } else { //用户
      wx.navigateTo({
        url: '../home/home?PartnerSysNo=' + PartnerSysNo + '&CustomerSysNo=' + CustomerSysNo
      })
    }
  },

  //置顶
  clicktotop: function () {
    var topHeight = 90 / (750 / app.globalData.systemInfo.windowWidth)
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: topHeight
      })
    }
  },

  //切换选项
  changeGroup: function (e) {
    var plansysno = e.currentTarget.dataset.plansysno
    if (parseInt(plansysno) == PlanSysNo) return
    //切换时清空弹幕数据
    that.setData({
      doommData: [],
    });

    //关闭弹幕定时器
    clearTimeout(doomtimer)

    PlanSysNo = plansysno

    //滚动到对应的planSysNo
    that.handleScroll(PlanSysNo);
    //获取分享图片
    getShareImage()
    //回到顶部
    that.clicktotop()

    var groupingList = that.data.GroupingList
    for (var i = 0; i < groupingList.length; i++) {
      var item = groupingList[i]
      if (parseInt(plansysno) == item.PlanSysNo) {
        item.select = true
      } else {
        item.select = false
      }
    }
    that.setData({
      GroupingList: groupingList,
    });

    //获取团详情
    that.getGroupDetailService()
    //获取团详情订单
    that.getGroupDetailOrderService()
  },
  openIndexPage: function (e) {
    that.hideCartModal()
    var index = e.currentTarget.dataset.index
    if (index == 1) {
      // console.log("店铺")
      var pageArray = getCurrentPages()
      if (app.globalData.CustomerInfo.CustomerType == 1) { //团长
        if (pageArray.length > 1) {
          wx.navigateBack({
            delta: pageArray.length
          })
        } else {
          wx.navigateTo({
            url: '../../pages/home/home',
          })
        }
      } else { //用户
        if (pageArray.length > 1) {
          wx.navigateBack({
            delta: pageArray.length
          })
        } else {
          wx.navigateTo({
            url: '../../pages/usercenter/usercenter',
          })
        }
      }
    } else if (index == 2) {
      // console.log("朋友")
    } else if (index == 3) {
      // console.log("朋友圈")
      that.getWXShareTimelineImgService()
    }
  },

  openCart: function () {
    console.log('打开购物车')
    if (that.data.hideCartModal) {
      that.setData({
        hideCartModal: false,
      })
      var animation = wx.createAnimation({
        duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      that.animation = animation
      setTimeout(function () {
        that.fadeIn(); //调用显示动画
      }, 0)
    } else {
      that.hideCartModal()
    }
  },
  hideCartModal: function () {
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideCartModal: true,
      })
    }, 300) //先执行下滑动画，再隐藏模块
  },
  //获取分享朋友圈图片
  getWXShareTimelineImgService: function () {

    var _param = {
      CustomerSysNo: CustomerSysNo, //客户编号
      PartnerSysNo: PartnerSysNo, //团长编号
      PlanSysNo: PlanSysNo, //计划号
      ShareSceneType: 2, //分享场景 AppEnum.ShareSceneType 1 对话 2 朋友圈
      SharePageType: 2, //页面类型 参见枚举 SharePageType
    }
    wx.showLoading({
      title: '加载中...',
    })
    login.getWXShareImgService(_param, function (res) {
      that.setData({
        showImage: true,
        shareImageUrl: res,
      })
    })
  },
  hideShareImage: function () {
    this.setData({
      showImage: false,
    })
  },

  saveShareImage: function () {
    //获取相册授权
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //这里是用户同意授权后的回调
              that.savaImageToPhoto();
            },
            fail() { //这里是用户拒绝授权后的回调
              wx.showToast({
                title: '您未对相册进行授权，无法将图片保存在相册中，请授权哟~',
                icon: 'none',
                duration: 3000
              })
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            }
          })
        } else { //用户已经授权过了
          that.savaImageToPhoto();
        }
      }
    })
  },
  savaImageToPhoto: function () {
    wx.downloadFile({
      url: that.data.shareImageUrl,
      success: function (res) {
        console.log('图片保存到本地', res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
            that.setData({
              showImage: false,
            })
          },
          fail: function (err) {
            console.log(err);
          },
          complete(res) {
            console.log(res);
          }
        })
      },
      fail: function (err) {
        console.log(err)
      },
    })
  },
  handleSetting: function (e) {
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      // wx.showModal({
      //   title: '提示',
      //   content: '若不打开授权，则无法将图片保存在相册中！',
      //   showCancel: false
      // })
      that.setData({
        saveImgBtnHidden: true,
        openSettingBtnHidden: false
      })
    } else {
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true
      })
    }
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        hasUserInfo: true,
      })
      //更新用户信息
      login.updateCustomerInfoService(CustomerSysNo, '', e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    } else {
      this.setData({
        hasUserInfo: false,
      })
    }
  },
  //处理弹幕数据
  dealDoommData: function () {
    // 动画时间随机
    // var orderlist = that.data.orderlist
    // var doomlist = []
    // for (var i = 0; i < orderlist.length; i++) {
    //   var item = orderlist[i]
    //   var productlist = item.ListGroupOrderItem
    //   for (var j = 0; j < productlist.length; j++) {
    //     var doomdata = {}
    //     var productitem = productlist[j]
    //     doomdata.AvatarUrl = item.AvatarUrl
    //     doomdata.ReceiveName = item.ReceiveName
    //     doomdata.ProductName = productitem.ProductName
    //     doomlist.push(doomdata)
    //   }
    // }

    var orderlist = that.data.orderlist
    var doomlist = []
    for (var i = 0; i < orderlist.length; i++) {
      var item = orderlist[i]
      var productlist = item.ListGroupOrderItem
      // for (var j = 0; j < productlist.length; j++) {
      var doomdata = {}
      var productitem = productlist[0]
      doomdata.AvatarUrl = item.AvatarUrl
      doomdata.ReceiveName = item.ReceiveName
      doomdata.ProductName = productitem.ProductName
      doomlist.push(doomdata)
      // }
    }
    var i = 0
    var timelast = 1000 //初始第一条弹幕 时间
    that.doomCountdown(i, timelast, doomlist)
  },
  // 弹幕随机时间倒计时
  doomCountdown: function (i, timelast, orderlist) {
    doomtimer = setTimeout(function () {
      //循环执行代码 
      if (i > orderlist.length - 1) {
        clearTimeout(doomtimer)
      } else {
        var item = orderlist[i]
        var message = ' ' + item.ReceiveName + ' 购买了' + item.ProductName + '  '
        var avatarUrl = item.AvatarUrl
        doommList.push(new Doomm(message, avatarUrl, Math.ceil(Math.random() * 100), 5, "white"));
        that.setData({
          doommData: doommList
        })
        i++
        if (i > 10) {
          timelast = (Math.floor(Math.random() * 9) + 7) * 1000
        } else {
          timelast = (Math.floor(Math.random() * 6) + 1) * 1000
        }
        that.doomCountdown(i, timelast, orderlist)
      }
    }, timelast);
  },


  //禁止蒙层后面滑动
  preventTouchMove: function (e) { },
  // 显示遮罩层
  showModal: function (e) {

    var index = e.currentTarget.dataset.index
    var listGroupProduct = that.data.ListGroupProduct
    var item = listGroupProduct[index]

    that.setData({
      hideModal: false,
      chooseProductDetail: item,
    })
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that.animation = animation
    setTimeout(function () {
      that.fadeIn(); //调用显示动画
    }, 0)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 300, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    that.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function () {
      that.setData({
        hideModal: true
      })
    }, 300) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function () {
    that.animation.translateY(0).step()
    that.setData({
      animationData: that.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function () {
    that.animation.translateY(1000).step()
    that.setData({
      animationData: that.animation.export(),
    })
  },

  /**
    * 动态改变scroll-left的值
  **/
  handleScroll(selectedId) {
    var query = wx.createSelectorQuery();//创建节点查询器
    query.select('#item-' + selectedId).boundingClientRect();//选择id='#item-' + selectedId的节点，获取节点位置信息的查询请求
    query.select('#scroll-view').boundingClientRect();//获取滑块的位置信息
    //获取滚动位置
    query.select('#scroll-view').scrollOffset();//获取页面滑动位置的查询请求
    query.exec(function (res) {
      if (res) {
        that.setData({
          scrollLeft: res[2].scrollLeft + res[0].left + res[0].width / 2 - res[1].width / 2
        });
      }
      console.log("res:::::::::::::::::::", res)
    });
  },
})

var doommList = [];
var i = 0;
class Doomm {
  constructor(text, avatarUrl, top, time, color) {
    this.text = text;
    this.avatarUrl = avatarUrl;
    // this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let page = this;
    this.id = i++;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(page), 1);
      that.setData({
        doommData: doommList
      })
    }, this.time * 1000)
  }
}

function notify(message) {
  Notify({
    duration: 2000,
    text: message,
    selector: '#message-notify',
    backgroundColor: 'red'
  });
}

function getShareImage() {
  var _param = {
    CustomerSysNo: CustomerSysNo, //客户编号
    PartnerSysNo: PartnerSysNo, //团长编号
    PlanSysNo: PlanSysNo, //计划号
    ShareSceneType: 1, //分享场景 AppEnum.ShareSceneType 1 对话 2 朋友圈
    SharePageType: 2, //页面类型 参见枚举 SharePageType
  }
  login.getWXShareImgService(_param, function (res) {
    shareImage = res
  })
}