// pages/publish/publish.js
import Notify from '../../zanui/dist/notify/notify.js'

var app = getApp()
const api = require('../../utils/api.js')
const appenum = require('../../utils/appenum.js')
const request = require('../../utils/request.js')
const method = require('../../utils/method.js')

var that
var StockSysNo
var FromUserSysNo
var MasterUserSysNo
var PartnerSysNo = ""   //团长编号

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx ? true : false,
    miniAppName: '',   //小程序名称
    PartnerInfo: null, //团长信息
    headIconRadia: false, //头像圆角

    createstoreupdateicon: '../../assets/images/lxp-createstoreupdateicon.png',
    // shenfenzhengzhengmian: '../../assets/images/lxp-shenfenzhengzheng.png',
    // shenfenzhengfanmian: '../../assets/images/lxp-shenfenzhengfan.png',

    storeName: '',
    storeDesc: '',
    storePlacemarks: '',
    storeAddress: '',
    storeDetailAddress: '',
    regimentalName: '',
    // regimentalIdCard: '',
    regimentalPhone: '',
    WXID: '',
    agreeService: false,
    formId: '',

    latitude: 0,
    longitude: 0,
    storeAllAddress: '',

    createstoreupdateicon_upload_percent: 0, //店铺头像上传进度
    // shenfenzhengzhengmian_upload_percent: 0, //身份证正面上传进度
    // shenfenzhengfanmian_upload_percent: 0, //身份证反面上传进度

    disable: false,
    loading: false,
    createStoreDesc: '立即创建',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this

    console.log('creategroup=====', options)
    PartnerSysNo = ""
    if (options.StockSysNo) {
      StockSysNo = options.StockSysNo
    } else {
      StockSysNo = 1 //默认上海仓
    }
    if (options.MasterUserSysNo) {
      MasterUserSysNo = options.MasterUserSysNo
    } else {
      var masterUserSysNo = method.getSysDataConfigValue("AdminMasterUserSysNo")
      if (masterUserSysNo.length > 0) {
        MasterUserSysNo = masterUserSysNo
      } else {
        MasterUserSysNo = 10 //默认管理员
      }
    }
    //用来判断打开来源用户
    if (options.FromUserSysNo) {
      app.globalData.FromUserSysNo = options.FromUserSysNo
    }

    that.setData({
      miniAppName: app.globalData.miniAppName,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    let cutImagePath = app.globalData.CutImagePath
    if (cutImagePath) {
      that.setData({
        headIconRadia: true,
        createstoreupdateicon: cutImagePath,
      })
      //获取团长编号
      that.getPartnerSysNoService(cutImagePath)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //清空剪切后的图片
    app.globalData.CutImagePath = null
  },

  //获取团长编号
  getPartnerSysNoService: function (cutImagePath) {
    if (PartnerSysNo.length == 0) {
      var _param = {
        CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      }
      var _success = function (res) {
        if (res.data.ResponseStatus.ErrorCode == 0) {
          PartnerSysNo = res.data.Entity.PartnerSysNo
          // that.uploadImageService({
          //   'key': 1,
          //   'value': cutImagePath
          // })
        }
      }
      request.requestGet(api.GetPartnerSysNoService, _param, _success, null, null)
    } else {
      // that.uploadImageService({
      //   'key': 1,
      //   'value': cutImagePath
      // })
    }
  },
  //选择地址
  chooseLocation() {
    let that = this
    method.getPermission(that, function (res) {
      that.getGisStockService(res)
    })
  },
  //获取可服务仓库列表
  getGisStockService: function (res) {
    var _param = {
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      GisLatitude: res.latitude,
      GisLongitude: res.longitude,
    }
    var _success = function (res) {
      var list = res.data.Entity
      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data != null && res.data.Entity != null) {
          if (list.length > 0) {
            StockSysNo = list[0].SysNo
          }
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    request.requestGet(api.GetGisStockService, _param, _success, _fail, null)
  },


  //获取手机号
  getPhoneNumber(e) {
    var that = this
    var _param = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      WXOpenId: app.globalData.CustomerInfo.WXOpenId
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        that.setData({
          regimentalPhone: res.data.Entity.purePhoneNumber
        });
      } else {
        notify(res.data.ResponseStatus.Message)
      }

    }
    var _fail = function (res) {
      notify('获取微信手机号失败')
    }
    request.requestGet(api.GetWXPhoneService, _param, _success, _fail, null)
  },

  onFieldChange: function (e) {
    if (e.currentTarget.id == 'storeName') {
      this.data.storeName = e.detail
    } else if (e.currentTarget.id == 'storeDesc') {
      this.data.storeDesc = e.detail
    } else if (e.currentTarget.id == 'storeDetailAddress') {
      this.data.storeDetailAddress = e.detail
    } else if (e.currentTarget.id == 'regimentalName') {
      this.data.regimentalName = e.detail
    } else if (e.currentTarget.id == 'regimentalIdCard') {
      this.data.regimentalIdCard = e.detail
    } else if (e.currentTarget.id == 'regimentalPhone') {
      this.data.regimentalPhone = e.detail
    } else if (e.currentTarget.id == 'WXID') {
      this.data.WXID = e.detail
    }
  },

  //选择图片
  uploadImage: function (res) {
    var that = this;
    //选择图片的类型 1门店头像  2身份证正面  3身份证反面 res.currentTarget.dataset.imagetype
    let imagetype = res.currentTarget.dataset.imagetype
    wx.chooseImage({
      count: 1, // 默认1
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        if (res.tempFilePaths != null && res.tempFilePaths.length > 0) {
          let tempFilePaths = res.tempFilePaths;
          if (imagetype == 1) {
            wx.navigateTo({
              url: '../imagecropper/imagecropper?src=' + tempFilePaths[0]
            })
          } else if (imagetype == 2) {
            // that.setData({
            //   shenfenzhengzhengmian: tempFilePaths[0],
            // })
            // that.uploadImageService({
            //   'key': imagetype,
            //   'value': tempFilePaths[0]
            // })
          } else if (imagetype == 3) {
            // that.setData({
            //   shenfenzhengfanmian: tempFilePaths[0],
            // })
            // that.uploadImageService({
            //   'key': imagetype,
            //   'value': tempFilePaths[0]
            // })
          }
        }
      }
    })
  },
  //同意协议
  checkboxChange: function (options) {
    this.setData({
      agreeService: !options.currentTarget.dataset.key
    })
  },
  //服务协议
  serviceAgreementClick: function () {
    // notify('服务协议')
    wx.navigateTo({
      url: '../serviceagreement/serviceagreement',
    })
  },

  //formId
  formSubmit(e) {
    this.data.formId = e.detail.formId
  },

  //立即创建
  createStoreClick: function () {
    var that = this
    if (this.data.createstoreupdateicon.indexOf("lxp-") != -1) {
      notify('请上传店铺头像')
      return
    }
    if (this.data.storeName.length == 0) {
      notify('请输入店铺名称')
      return
    }
    if (this.data.storeDesc.length == 0) {
      notify('请输入店铺简介')
      return
    }
    if (this.data.storeAllAddress.length == 0) {
      notify('请选择店铺位置')
      return
    }
    if (this.data.storeDetailAddress.length == 0) {
      notify('请输入店铺地址')
      return
    }
    if (this.data.regimentalName.length == 0) {
      notify('请输入团长姓名')
      return
    }
    // if (this.data.regimentalIdCard.length == 0) {
    //   notify('请输入团长身份证号')
    //   return
    // }
    // if (method.checkIDCard(this.data.regimentalIdCard) == false) {
    //   notify('请输入正确的身份证号')
    //   return
    // }
    if (this.data.WXID.length == 0) {
      notify('请输入团长微信号')
      return
    }
    if (this.data.regimentalPhone.length == 0) {
      notify('请输入团长联系方式')
      return
    }
    // if (method.validateTellPhone(this.data.regimentalPhone) == false) {
    //   notify('请输入正确的手机号码')
    //   return
    // }
    // if (this.data.shenfenzhengzhengmian.indexOf("lxp-") != -1) {
    //   notify('请上传身份证正面照片')
    //   return
    // }
    // if (this.data.shenfenzhengfanmian.indexOf("lxp-") != -1) {
    //   notify('请上传身份证反面照片')
    //   return
    // }
    if (this.data.agreeService == false) {
      var message = '请阅读并同意' + that.data.miniAppName + '服务协议'
      notify(message)
      return
    }
    that.setData({
      disable: true,
      loading: true,
    })
    //先上传图片
    that.uploadImageService({
      'key': 1,
      'value': that.data.createstoreupdateicon
    })
  },
  //上传图片到服务器
  uploadImageService: function (e) {

    var that = this
    var data = {};
    if (e.key == 1) { //店铺头像
      data.FileName = PartnerSysNo + '.jpg'
      data.FileDetailType = appenum.UploadFileDetailType.PartnerPic.Value
    } else if (e.key == 2) { //身份证正面
      data.FileName = PartnerSysNo + '_IDCard1' + '.jpg'
      data.FileDetailType = appenum.UploadFileDetailType.PartnerIDCardPic.Value
    } else if (e.key == 3) { //身份证反面
      data.FileName = PartnerSysNo + '_IDCard2' + '.jpg'
      data.FileDetailType = appenum.UploadFileDetailType.PartnerIDCardPic.Value
    }
    data.FileType = appenum.UploadFileType.Image.Value
    data.StockSysNo = StockSysNo
    data.SysNo = PartnerSysNo

    var _success = function (res) {
      //提交申请团长
      that.applyPartnerService()

      if (e.key == 1) {

      } else if (e.key == 2) {
        // that.setData({
        //   shenfenzhengzhengmian: e.value,
        // })
      } else if (e.key == 3) {
        // that.setData({
        //   shenfenzhengfanmian: e.value,
        // })
      }
    }
    var _fail = function (res) {

    }
    var _progress = function (res) {
      if (e.key == 1) {
        that.setData({
          createstoreupdateicon_upload_percent: res.progress,
        });
      } else if (e.key == 2) {
        // that.setData({
        //   shenfenzhengzhengmian_upload_percent: res.progress,
        // });
      } else if (e.key == 3) {
        // that.setData({
        //   shenfenzhengfanmian_upload_percent: res.progress,
        // });
      }
    }
    request.uploadFile(data, e.value, _success, _fail, _progress)
  },

  //提交申请团长
  applyPartnerService: function () {

    var _param = {
      CustomerSysNo: app.globalData.CustomerInfo.SysNo, //客户编号
      PartnerSysNo: PartnerSysNo,     //团长编号
      PartnerImageName: PartnerSysNo + '.jpg', //文件名
      PartnerName: this.data.storeName, //店铺名称
      PartnerDesc: this.data.storeDesc, //店铺简介
      ContactsName: this.data.regimentalName, //姓名
      PartnerPhone: this.data.regimentalPhone, //手机号
      StockSysNo: StockSysNo, //仓库编号 页面打开参数
      MasterUserSysNo: MasterUserSysNo, //师长编号 页面打开参数
      Placemarks: this.data.storePlacemarks, //小区地标
      Address: this.data.storeDetailAddress, //详细地址
      AddrLatitude: this.data.latitude, //纬度
      AddrLongitude: this.data.longitude, //经度
      // IDCardNo: this.data.regimentalIdCard, //身份证号码
      WXID: this.data.WXID, //微信号
      // IDCardImage1Name: app.globalData.CustomerInfo.SysNo + '_IDCard1' + '.jpg', //文件名
      // IDCardImage2Name: app.globalData.CustomerInfo.SysNo + '_IDCard2' + '.jpg', //文件名
      FormId: this.data.formId,
    }
    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        wx.showModal({
          title: '温馨提示',
          content: '信息已提交成功 等待审核中...',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              var pageArray = getCurrentPages()
              if (pageArray.length > 1) {
                wx.navigateBack({
                  delta: pageArray.length
                })
              }
            }
          }
        })
        that.setData({
          disable: true,
          createStoreDesc: '信息已提交成功 等待审核中...',
        })
      } else {
        notify(res.data.ResponseStatus.Message)
        that.setData({
          disable: false,
        })
      }
    }
    var _fail = function (res) {

      that.setData({
        disable: false,
      })
      notify('团长申请失败')
    }
    var _complete = function (res) {
      that.setData({
        loading: false,
      })
    }
    request.requestPost(api.ApplyPartnerService, _param, _success, _fail, _complete)
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