module.exports = {

  //获取系统配置 Get
  GetSysDataConfigService: "GetSysDataConfigService",
  //获取团长状态
  GetCustomerCacheService: "GetCustomerCacheService",
  //获取团长编号 Get
  GetPartnerSysNoService: "GetPartnerSysNoService",

  //客户微信登录注册接口  post
  CustomerWXLoginService: "CustomerWXLoginService",
  //更新客户手机接口（客户下单无手机号时，请先获取客户微信手机号，并更新用户信息）  post
  UpdateCustomerInfoService: "UpdateCustomerInfoService",
  //获取手机号
  GetWXPhoneService: "GetWXPhoneService",
  //上传图片
  WXUploadFileService: "WXUploadFileService",

  //团长申请、团长资料修改、团长审核等接口
  ApplyPartnerService: "ApplyPartnerService",
  //获取团长信息接口 Get  （客户打开团长分享时，就可以获取）
  GetPartnerInfoService: "GetPartnerInfoService",
  //更新团长信息  Post
  UpdatePartnerService: "UpdatePartnerService",
  //获取团长休假处理 （团长休假状态切换） Post
  PartnerVacationService: "PartnerVacationService",

  //获取团长收益 Get （仅仅团长自己打开才看）
  GetPartnerProfitService: "GetPartnerProfitService",
  //团长收益排行 Get 
  GetPartnerSalesRankService: "GetPartnerSalesRankService",
  //团长每日收益  Get 
  GetPartnerDateProfitService: "GetPartnerDateProfitService",
  //团长收益明细 Get
  GetPartnerProfitLogService: "GetPartnerProfitLogService",
  //团长未结算收益(预估收益) Get
  GetPartnerUnSettleProfitService: "GetPartnerUnSettleProfitService",

  //团长销售报表 get
  GetPartnerSalesService: "GetPartnerSalesService",

  //获取拼团中列表  Get
  GetGroupingListService: "GetGroupingListService",
  //获取团详情 Get
  GetGroupDetailService: "GetGroupDetailService",
  //获取团详情订单列表 Get
  GetGroupDetailOrderService: "GetGroupDetailOrderService",
  //团长-我分享的团 Get 
  GetPartnerGroupListService: "GetPartnerGroupListService",
  //我分享的团-按照订单分 Get
  GetGroupOrderListService: "GetGroupOrderListService",
  //我分享的团-按照商品分 Get
  GetGroupOrderProductSumService: "GetGroupOrderProductSumService",
  //我参与的团 Get
  GetCusGroupListService: "GetCusGroupListService",
  //提交订单 post
  SubmitOrderService: "SubmitOrderService",
  //提交订单-商城模式 Post 
  SubmitOrderShoppingService: "SubmitOrderShoppingService",
  //获取订单支付信息 Get
  GetWXCusPayParamsService: "GetWXCusPayParamsService",
  //取消订单  Post
  CancelOrderService: "CancelOrderService",
  //团长签收
  PartnerReceiveOrderService: "PartnerReceiveOrderService",
  //客户签收订单  post
  CustomerReceiveOrderService: "CustomerReceiveOrderService",
  //获取分享图片 Get
  GetWXShareImgService: "GetWXShareImgService",
  //最近访问的店铺 get
  GetCustomerAccessPartnerService: "GetCustomerAccessPartnerService",
  //获取附近门店 Get
  GetGisPartnerService: "GetGisPartnerService",
  //用户信息 get
  CustomerService: "CustomerService",

  //微信分享打开日志上报 Post
  SaveWXShareLogService: "SaveWXShareLogService",

  //商家& 团长订单列表 Get  
  GetOrderListService: "GetOrderListService",
  //商家& 团长订单商品汇总 Get
  GetOrderProductSumService: "GetOrderProductSumService",
  //我的订单 Get
  GetCusOrderListService: "GetCusOrderListService",
  //取消订单
  CancelOrderShoppingService: "CancelOrderShoppingService",
  //客户签收
  CusRecOrderShoppingService: "CusRecOrderShoppingService",
  //团长签收
  ParRecOrderShoppingService: "ParRecOrderShoppingService",

  //根据gis经纬度，获取可服务仓库列表 Get
  GetGisStockService: "GetGisStockService",
}