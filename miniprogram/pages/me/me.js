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
    let that = this;
    let promiseArr = [];
    promiseArr.push(
      new Promise((resolve, reject) => {
        wx.login({
          timeout: 3600,
          success: res => {
            resolve(res.code)
          },
          fail: (msg) => {
            console.log(msg);
          }
        })
      }),
      new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: '用于获取用户信息',
          success: res => {
            resolve(res.userInfo)
          }
        })
      })
    );

    Promise.all(promiseArr).then((values) => {
      let code = values[0];
      // 发起登录请求
      wx.request({
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        method: "GET",
        data: {
          "appid": "wx9413db1f8e137fb0",
          "secret": "b0cf3a7bd5f34036d1afd9c153829fb5",
          "js_code": code,
          "grant_type": "authorization_code"
        },
        success: res => {
          let temp = res;
          // 获取当前用户
          wx.request({
            url: 'http://localhost:8080/user/getUser',
            method: "POST",
            header: {
              "content-type": " application/x-www-form-urlencoded "
            },
            data: {
              openId: res.data.openid
            },
            success: res => {
              let loginUser = {
                "username": values[1].nickName,
                "password": "",
                "phone": "",
                "sex":values[1].gender,
                "userid": temp.data.openid,
                "headerImage": values[1].avatarUrl
              };
              // 当用户不存在的时候
              if (res.data.code == 400004) {
                wx.request({
                  url: 'http://localhost:8080/user/sign',
                  method: "POST",
                  header: {
                    "content-type": "application/json; charset=UTF-8"
                  },
                  data: loginUser,
                  success: res => {
                    if (res.data.code == 200000) {
                      wx.setStorageSync("user", loginUser)
                    }
                  }
                })
              } else {
                loginUser = res.data.data;
                wx.setStorageSync("user", loginUser)
              }
              // 最后刷新数据
              that.setData({
                user: loginUser
              })
            }
          })
        }
      })
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