//app.js
var that
const method = require('/utils/method.js')
const request = require('/utils/request.js')
const login = require('/utils/applogin.js')
App({
  onLaunch: function (options) {
    that = this
    //初始化app
    initApp()
    //记录启动项
    that.globalData.launchOptions = options
  },
  globalData: {
    launchOptions: null,
    fromOpenGId: null,        //群编号
    userInfo: null,
    systemInfo: null,         //系统信息
    isIpx: false,             //是否是iPhone X系列
    networkType: null,        //网络状态
    CustomerInfo:null,        //登录成功后用户信息数据
    PartnerInfo: null,        //团长信息
    FromUserSysNo:null,       //来源用户no
    latitude: null,               //定位经纬度
    longitude: null,

    sysDataConfig:null,       //项目配置
    miniAppName: '邻鲜拼',     //小程序名称  系统配置有MiniAppName 则使用MiniAppName，否则使用 '邻鲜拼'
  }
})
function initApp() {
  //初始化
  login.initApp(that)
  request.initApp(that)
  method.initApp(that)  
  
  //登录
  login.userlogin()
  //获取系统配置
  login.getSysDataConfig()
}