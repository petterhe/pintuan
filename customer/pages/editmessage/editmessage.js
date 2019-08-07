// pages/editmessage/editmessage.js
import Notify from '../../zanui/dist/notify/notify.js'

var app = getApp()
const api = require('../../utils/api.js')
const appenum = require('../../utils/appenum.js')
const request = require('../../utils/request.js')
const method = require('../../utils/method.js')
var imageName = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {

    PartnerInfo: null,        //团长信息
    regimentalPhone: '',
    createstoreupdateicon: '../../assets/images/lxp-createstoreupdateicon.png',
    createstoreupdateicon_upload_percent: 0, //店铺头像上传进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      PartnerInfo: app.globalData.PartnerInfo,
      createstoreupdateicon: app.globalData.PartnerInfo.PartnerImageUrl,
      regimentalPhone: app.globalData.PartnerInfo.PartnerPhone,
    })

    imageName = ""
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
        createstoreupdateicon: cutImagePath,
      })
      that.uploadImageService({
        'key': 1,
        'value': cutImagePath
      })
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

  onFieldChange: function (e) {

    if (e.currentTarget.id == 'storeName') {
      this.data.PartnerInfo.PartnerName = e.detail
    } else if (e.currentTarget.id == 'storeDesc') {
      this.data.PartnerInfo.PartnerDesc = e.detail
    }
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
      console.log('===', res)
      if (res.data.ResponseStatus.ErrorCode == 0) {
        that.data.PartnerInfo.PartnerPhone = res.data.Entity.purePhoneNumber
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
          }
        }
      }
    })
  },

  //上传图片到服务器
  uploadImageService: function (e) {

    imageName = app.globalData.PartnerInfo.PartnerSysNo + '.jpg'

    var that = this
    var data = {};
    if (e.key == 1) { //店铺头像
      data.FileName = imageName
      data.FileDetailType = appenum.UploadFileDetailType.PartnerPic.Value
    }
    data.FileType = appenum.UploadFileType.Image.Value
    data.StockSysNo = app.globalData.PartnerInfo.StockSysNo
    data.SysNo = app.globalData.CustomerInfo.SysNo

    var _success = function (res) {

    }
    var _fail = function (res) {

    }
    var _progress = function (res) {
      if (e.key == 1) {
        that.setData({
          createstoreupdateicon_upload_percent: res.progress,
        });
      }
    }
    request.uploadFile(data, e.value, _success, _fail, _progress)
  },

  //更新团长信息
  createStoreClick: function () {

    var _param = {
      PartnerSysNo: app.globalData.PartnerInfo.PartnerSysNo, //客户编号
      // PartnerImageName: app.globalData.CustomerInfo.SysNo + '.jpg', //文件名
      PartnerDesc: this.data.PartnerInfo.PartnerDesc, //店铺简介
      PartnerName: this.data.PartnerInfo.PartnerName, //店铺名称
      PartnerPhone: this.data.PartnerInfo.PartnerPhone, //手机号
    }

    if (imageName) {
      _param.PartnerImageName = imageName
    }

    var _success = function (res) {

      if (res.data.ResponseStatus.ErrorCode == 0) {
        if (res.data.Entity != null) {
          app.globalData.PartnerInfo = res.data.Entity
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 1000,
            mask: true,
            success: function () {
              wx.navigateBack()
            }
          })
        }
      } else {
        notify(res.data.ResponseStatus.Message)
      }
    }
    var _fail = function (res) {

    }
    var _complete = function (res) {

    }
    request.requestPost(api.UpdatePartnerService, _param, _success, _fail, _complete)
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