
/** 服务请求日志类型编号 */
if (typeof ClientType == "undefined") {
  var ClientType = {
    WXXCX: {
      Value: 1,
      Name: '微信小程序'
    },
    AliXCX: {
      Value: 2,
      Name: '支付宝小程序'
    },
    Wap: {
      Value: 3,
      Name: '网页'
    },
  }
}
/** SalesManSysNo类型编号 */
if (typeof SalesManSysNo == "undefined") {
  var SalesManSysNo = {
    WXXCX: {
      Value: 1,
      Name: '微信小程序'
    },
    AliXCX: {
      Value: 2,
      Name: '支付宝小程序'
    },
  }
}
/**  APP编号 80001：商家版小程序 80002:客户版小程序  80003:WAP  80010:ERP */
if (typeof AppID == "undefined") {
  var AppID = {
    MiniApp_Company: {
      Value: 80001,
      Name: '商家版小程序'
    },
    MiniApp_Customer: {
      Value: 80002,
      Name: '客户版小程序'
    },
    WAP: {
      Value: 80003,
      Name: 'WAP'
    },
    Erp: {
      Value: 80010,
      Name: 'ERP'
    },
  }
}
/**  CustomerType 与 PartnerType一致 */
if (typeof CustomerType == "undefined") {
  var CustomerType = {
    Normal: {
      Value: 0,
      Name: '普通用户'
    },
    Group: {
      Value: 1,
      Name: '团长'
    },
  }
}
/**  团长状态 状态 -1：无效 0：待审核 1：已生效 */
if (typeof PartnerStatus == "undefined") {
  var PartnerStatus = {
    InValid: {
      Value: -2,
      Name: '无效'
    },
    UnAudit: {
      Value: -1,
      Name: '审核未通过'
    },
    WaitAudit: {
      Value: 0,
      Name: '待审核'
    },
    Valid: {
      Value: 1,
      Name: '已生效'
    },
    Vacation: {
      Value: 2,
      Name: '休假'
    },
  }
}
/**  商品状态 1：上架 0：下架 -1：无效 */
if (typeof ProductStatus == "undefined") {
  var ProductStatus = {
    InValid: {
      Value: -1,
      Name: '无效'
    },
    NoShelf: {
      Value: 0,
      Name: '下架'
    },
    OnShelf: {
      Value: 1,
      Name: '上架'
    },
  }
}
/**  订单状态 -1：无效 0：待支付 1：已支付待打包 2：已打包待配货 3：配货中 4：团长签收 待自提 5：客户已签收 */
if (typeof OrderStatus == "undefined") {
  var OrderStatus = {
    InValid: {
      Value: -2,
      Name: '作废'
    },
    CustomerCancel: {
      Value: -1,
      Name: '客户取消'
    },
    WaitingPay: {
      Value: 0,
      Name: '待支付'
    },
    WaitingOutStock: {
      Value: 1,
      Name: '已支付待打包'
    },
    OutStock: {
      Value: 2,
      Name: '已打包待配货'
    },
    Deliverying: {
      Value: 3,
      Name: '配货中'
    },
    PartnerReceived: {
      Value: 4,
      Name: '团长签收待自提'
    },
    CustomerReceived: {
      Value: 5,
      Name: '客户已签收'
    },
  }
}
/**  保存图片类型 1团封面 2 商品图片 3 团长店铺 4团长身份证 */
if (typeof UploadFileDetailType == "undefined") {
  var UploadFileDetailType = {
    GroupPlanPic: {
      Value: 1,
      Name: '团封面'
    },
    ProductPic: {
      Value: 2,
      Name: '商品图片'
    },
    PartnerPic: {
      Value: 3,
      Name: '团长照片'
    },
    PartnerIDCardPic: {
      Value: 4,
      Name: '团长身份证照片'
    },
  }
}
/**  保存图片类型 1团封面 2 商品图片 3 团长店铺 4团长身份证 */
if (typeof UploadFileType == "undefined") {
  var UploadFileType = {
    Image: {
      Value: 1,
      Name: '图片'
    },
    PDF: {
      Value: 2,
      Name: 'PDF'
    },
    Txt: {
      Value: 3,
      Name: '文本文档'
    },
  }
}

/**  状态 -1：已作废 0：待开团 1：拼团中 2：已结束 */
if (typeof GroupPlanStatus == "undefined") {
  var GroupPlanStatus = {
    InValid: {
      Value: -1,
      Name: '已作废'
    },
    WaitStart: {
      Value: 0,
      Name: '待开团'
    },
    Grouping: {
      Value: 1,
      Name: '拼团中'
    },
    End: {
      Value: 2,
      Name: '已结束'
    },
  }
}

/**  团长等级 */
if (typeof PartnerGrade == "undefined") {
  var PartnerGrade = {
    ChuJi: {
      Value: 1,
      Name: '初级团长'
    },
    ZhongJi: {
      Value: 2,
      Name: '中级团长'
    },
    GaoJi: {
      Value: 3,
      Name: '高级团长'
    },
  }
}

/** 小程序分享页面类型 */
if (typeof SharePageType == "undefined") {
  var SharePageType = {
    PartnerHome: {
      Value: 1,
      Name: '团长主页'
    },
    PlanDetail: {
      Value: 2,
      Name: '团详情'
    },
    ApplyPartner: {
      Value: 3,
      Name: '申请团长'
    },
    SubmitOrder: {
      Value: 4,
      Name: '下单完成'
    },
  }
}

/** 收益排行类型 */
if (typeof ProfitRankType == "undefined") {
  var ProfitRankType = {
    Today: {
      Value: 1,
      Name: '今日'
    },
    Yesterday: {
      Value: 2,
      Name: '昨日'
    },
    Week: {
      Value: 3,
      Name: '周'
    },
    Month: {
      Value: 4,
      Name: '月'
    },
    Year: {
      Value: 5,
      Name: '年'
    },
    Total: {
      Value: 6,
      Name: '总排行'
    },
  }
}

/**   收益日志类型 类型 1、订单收益 11、提现 */
if (typeof ProfitLogType == "undefined") {
  var ProfitLogType = {
    OrderProfit: {
      Value: 1,
      Name: '订单收益'
    },
    RefundProfit: {
      Value: 11,
      Name: '退货收益'
    },
    CashOut: {
      Value: 21,
      Name: '提现'
    },
  }
}

/**
 * 团长销售表类型
 */
if (typeof PartnerSalesReportType == "undefined") {
  var PartnerSalesReportType = {
    Group_Partner_Date: {
      Value: 1,
      Name: '按日期按团长分销售报表'
    },
    Group_Date_Partner: {
      Value: 2,
      Name: '按团长按日期分销售报表'
    },
    Group_Partner: {
      Value: 3,
      Name: '按团长分销售汇总报表'
    },
    Group_Date: {
      Value: 4,
      Name: '按日期分销售汇总报表'
    },

  }
}

/** 微信分享打开日志上报 */
if (typeof ShareLogType == "undefined") {
  var ShareLogType = {
    Share: {
      Value: 1,
      Name: '分享'
    },
    Open: {
      Value: 2,
      Name: '打开'
    },
    Scene: {
      Value: 3,
      Name: '扫描二维码'
    },
  }
}

module.exports = {
  ClientType: ClientType,
  SalesManSysNo: SalesManSysNo,
  AppID: AppID,
  CustomerType: CustomerType,
  PartnerStatus: PartnerStatus,
  ProductStatus: ProductStatus,
  OrderStatus: OrderStatus,
  UploadFileDetailType: UploadFileDetailType,
  UploadFileType: UploadFileType,
  GroupPlanStatus: GroupPlanStatus,
  PartnerGrade: PartnerGrade,
  ProfitRankType: ProfitRankType,
  ProfitLogType: ProfitLogType,
  PartnerSalesReportType: PartnerSalesReportType,
  SharePageType: SharePageType,
  ShareLogType: ShareLogType,
}