// miniprogram/pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    activeNames: ['1'],
    items: [
      {
        "icon": "location-o",
        "text": "我的地址",
        "url":"../myAddress/index"
      },
      {
        "icon": "todo-list-o",
        "text": "充值记录",
        "url":"../payList/index"
      },
      {
        "icon": "more-o",
        "text": "提现记录",
        "url":"../txPage/index"
      },
      {
        "icon": "bag-o",
        "text": "我的订单",
        "url":"../myOrder/index"
      },
      {
        "icon": "clock-o",
        "text": "我发布的",
        "url":"../OrderListByUser/index"
      },
      {
        "icon": "close",
        "text": "我的欠费信息",
        "url": "../myArre/index"
      },
    ]
  },
  onChange(event) {
    console.log(event.detail);
    this.setData({
      activeNames: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    // 获取当前的登录状态
    var user = wx.getStorageSync("user");
    if(user != null && user.username != ""){
      that.setData({
        user:user
      })
    }else{
      wx.redirectTo({
        url: '../login/index',
      })
    }
  },

  moneyInfo(){
    wx.navigateTo({
      url: '../moneyInfo/index',
    })
  },

  LoginSys: function () {
    wx.redirectTo({
      url: '../login/index',
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
    this.getTabBar().init();
    let that =this;
    var loginUser = wx.getStorageSync('user');

    // 获取当前的登录状态
    if(that.data.user==null){
      if(loginUse !=null && loginUser.username != ""){
        that.setData({
          user:loginUser
        })
      }else{
        wx.navigateTo({
          url: '../login/index',
        })
      }
    }
  },

  toInfo:function(){
    wx.redirectTo({
      url: '../my/index',
    })
  },
})