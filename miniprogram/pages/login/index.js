// pages/login/index.js
const app = getApp();
import Toast from '../../@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
    sms: "",
    phone: "",
    userName:"",
    password:"",
    isPhone:true,
    agreement:false
  },

  CheckTheAgreement(){
    // 自定义加载图标
    Toast({
      message: '暂无协议，等待制定....',
      forbidClick: true
    });
  },
  onChange(event) {
    this.setData({
      agreement: event.detail,
    });
  },
  phone(){
    this.setData({
      isPhone:true
    })
  },
  password(){
    this.setData({
      isPhone:false
    })
  },
  check: function () {
    let that = this;
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

    if (that.data.phone == "" || that.data.phone.length < 0 || that.data.phone.length > 11 || !reg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'error'
      })
    } else if (that.data.sms == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: 'error'
      })
    } else {
      wx.request({
        url: app.url.url + 'user/check',
        method: "POST",
        data: {
          "phone": that.data.phone,
          "sms": that.data.sms
        },
        header: {
          "content-type": " application/x-www-form-urlencoded "
        },
        success: res => {
          if (res.data.code == 400004) {
            wx.showToast({
              title: '验证码错误',
              icon: 'error'
            })
          } else {
            wx.setStorageSync("user", res.data.data);
            wx.switchTab({
              url: '../me/me',
            })
          }
        }
      })
    }
  },

  checkPass(){
    if(this.data.userName == '' || this.data.password == ''){
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
    }else{
      let that = this;
      wx.request({
        url: app.url.url + 'user/passwdByUser',
        method:'POST',
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          userName:that.data.userName,
          password:that.data.password
        },
        success:res=>{
          console.log(res)
          if(res.data.code==200000){
            wx.setStorageSync("user", res.data.data);
               // 最后跳转
               wx.switchTab({
                url: '../me/me',
              })
          }else{
            wx.showToast({
              title: '用户不存在',
              icon: 'error'
            })
          }
        }
      })
    }
  
  },

  LoginSys: function () {
    // 封装微信的登录
    let promiseArr = [];
    if(this.data.agreement == false){
      Toast({
        message: '请同意用户协议！',
        forbidClick: true
      });
      return;
    }
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
              url: app.url.url + '/user/getUser',
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
                  // 其实这里需要修改
                  "name":values[1].nickName,
                  "sex":values[1].gender,
                  "userId": temp.data.openid,
                  "headerImage": values[1].avatarUrl,
                  "decimals":0.00
                };
                // 当用户不存在的时候
                if (res.data.code == 400004) {
                  wx.request({
                    url:  app.url.url+'/user/sign',
                    method: "POST",
                    header: {
                      "content-type": "application/json; charset=UTF-8"
                    },
                    data: loginUser,
                    success: res => {
                      if (res.data.code == 200000) {
                        wx.setStorageSync('user', loginUser)
                      }
                    }
                  })
                } else {
                  loginUser = res.data.data;
                  wx.setStorageSync("user", loginUser)
                }
                // 最后跳转
                wx.switchTab({
                  url: '../index/index',
                })
              }
            })
          }
        })
      })
      // // 加载图标
      // Toast.loading({
      //   message: '加载中...',
      //   forbidClick: true,
      //   loadingType: 'spinner',
      //   duration: 60*1000
      // });
      // let code = values[0];
      // var data = {
      //   "username": values[1].nickName,
      //   "code":code,
      //   "name":values[1].nickName,
      //   "sex":values[1].gender,
      //   "headerImage": values[1].avatarUrl,
      // };
      // console.log(data);
      // console.log("猜猜走的哪里！"+code);
      // wx.request({
      //   url: app.url.url + 'user/signOrLogin',
      //   method: 'POST',
      //   header: {
      //     'Content-Type':'application/json',
      //     // "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   data:{
      //     "username": values[1].nickName,
      //     "userId":code, 
      //     "name":values[1].nickName,
      //     "sex":values[1].gender,
      //     "headerImage": values[1].avatarUrl,
      //   },
      //   success:result =>{
      //     console.log(result.data.data);
      //     wx.setStorageSync("user", result.data.data);
      //     Toast.clear()
      //     // 最后跳转
      //     wx.switchTab({
      //       url: '../index/index',
      //     })
      //   },fail:error =>{
      //     Toast.fail('登录失败，请联系管理员！');
      //     console.log(error);
      //     Toast.clear()
      //   }
      // })
    })
      // // 发起登录请求
      // wx.request({
      //   url: 'https://api.weixin.qq.com/sns/jscode2session',
      //   method: "GET",
      //   data: {
      //     "appid": "wxab311ec7a521e53e",
      //     "secret": "90edbea4ffe0c30478b0877f729d7eb7",
      //     "js_code": code,
      //     "grant_type": "authorization_code"
      //   },
      //   success: resApi => {
      //     let temp = resApi;
      //     console.log("服务器验证用户信息！");
      //     // 获取当前用户
      //     wx.request({
      //       url: app.url.url + '/user/getUser',
      //       method: "POST",
      //       header: {
      //         "content-type": " application/x-www-form-urlencoded "
      //       },
      //       data: {
      //         openId: resApi.data.openid
      //       },
      //       success: res => {
      //         let loginUser = {
      //           "username": values[1].nickName,
      //           "password": "",
      //           "phone": "",
      //           // 其实这里需要修改
      //           "name":values[1].nickName,
      //           "sex":values[1].gender,
      //           // "userId": temp.data.openid,
      //           "headerImage": values[1].avatarUrl,
      //           // "decimals":0.00
      //         };
      //         console.log("服务器查询用户信息登录返回："+res.data.code);
      //         console.log("服务器查询用户信息登录返回："+res.code);
      //         // 当用户不存在的时候
      //         if (res.data.code == 400004) {
      //           wx.request({
      //             url: app.url.url + '/user/sign',
      //             method: "POST",
      //             header: {
      //               "content-type": "application/json; charset=UTF-8"
      //             },
      //             data: loginUser,
      //             success: res => {
      //               if (res.data.code == 200000) {
      //                 wx.setStorageSync('user', loginUser)
      //               }
      //             }
      //           })
      //         } 
      //         // loginUser = res.data.data;
      //         wx.setStorageSync("user", loginUser)
          
      //         // 最后跳转
      //         wx.switchTab({
      //           url: '../index/index',
      //         })
      //       }
      //     })
      //   }
      // })
    // })

    // Promise.all(promiseArr).then((values) => {
    //   console.log(values);
    //   let code = values[0];
    //   values.forEach((i,t)=>console.log(i+"  "+t));
    //   console.log("code = " + code);
    //   console.log("发起登录请求的API");
    //   // 发起登录请求
    //   wx.request({
    //     url: 'https://api.weixin.qq.com/sns/jscode2session',
    //     method: "GET",
    //     data: {
    //       "appid": "wxab311ec7a521e53e",
    //       "secret": "90edbea4ffe0c30478b0877f729d7eb7",
    //       "js_code": code,
    //       "grant_type": "authorization_code"
    //     },
    //     success: resApi => {
    //       let temp = resApi;
    //       console.log("服务器验证用户信息！");
    //       // 获取当前用户
    //       wx.request({
    //         url: app.url.url + '/user/getUser',
    //         method: "POST",
    //         header: {
    //           "content-type": " application/x-www-form-urlencoded "
    //         },
    //         data: {
    //           openId: resApi.data.openid
    //         },
    //         success: res => {
    //           let loginUser = {
    //             "username": values[1].nickName,
    //             "password": "",
    //             "phone": "",
    //             // 其实这里需要修改
    //             "name":values[1].nickName,
    //             "sex":values[1].gender,
    //             // "userId": temp.data.openid,
    //             "headerImage": values[1].avatarUrl,
    //             // "decimals":0.00
    //           };
    //           console.log("服务器查询用户信息登录返回："+res.data.code);
    //           console.log("服务器查询用户信息登录返回："+res.code);
    //           // 当用户不存在的时候
    //           if (res.data.code == 400004) {
    //             wx.request({
    //               url: app.url.url + '/user/sign',
    //               method: "POST",
    //               header: {
    //                 "content-type": "application/json; charset=UTF-8"
    //               },
    //               data: loginUser,
    //               success: res => {
    //                 if (res.data.code == 200000) {
    //                   wx.setStorageSync('user', loginUser)
    //                 }
    //               }
    //             })
    //           } 
    //           // loginUser = res.data.data;
    //           wx.setStorageSync("user", loginUser)
          
    //           // 最后跳转
    //           wx.switchTab({
    //             url: '../index/index',
    //           })
    //         }
    //       })
    //     }
    //   })
    // })
  },


  sendSms: function () {
    let that = this;
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (that.data.phone == "" || that.data.phone.length < 0 || that.data.phone.length > 11 || !reg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'error'
      })
    } else {

      // 发送任务
      wx.request({
        url: app.url.url + '/user/sendSms',
        method: "POST",
        data: {
          "phone": that.data.phone
        },
        header: {
          "content-type": " application/x-www-form-urlencoded "
        },
        success: res => {
          if (res.data.code != 200000) {
            wx.showToast({
              title: '该手机号未注册',
              icon: 'error'
            })
          } else {
            // 定时器
            let that = this;
            that.setData({
              time: 60
            })

            // 定时器接受
            var times = 60
            var i = setInterval(function () {
              times--
              if (times <= 0) {
                that.setData({
                  time: 0
                })
                clearInterval(i)
              } else {
                that.setData({
                  time: times
                })
              }
            }, 1000)
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})