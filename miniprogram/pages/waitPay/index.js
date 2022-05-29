// pages/waitPay/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:0,
    orderId:"",
    image:"",
    user:null
  },
  over() {
    let that=this;
    // 如果到0了之后就会删除订单记录
  // 取消订单的处理
  wx.request({
    url: app.url.url + '/pay/pay/notPay',
    method:'POST',
    header:{
      "Content-Type":"application/json"
    },
    data:{
      "userId":that.data.user.userId,
      "orderId":that.data.orderId
    },
    success:res=>{
      console.log(res)
      wx.redirectTo({
        url: '../moneyInfo/index',
      })
    }
  })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    this.setData({
      time:wx.getStorageSync('time'),
      user:wx.getStorageSync('user'),
      image:options.img,
      orderId:options.orderId
    })
    // let times=setInterval(function(){
    //   if(that.data.time==0){
    //     wx.setStorageSync('time', null)
    //     clearInterval(times);
    //   }
    //   // 每秒钟设置一下时间
    //   wx.setStorageSync('time', that.data.time)
    //   console.log(options)
    //   wx.request({
    //     url: app.url.url + '/pay/order/status/'+options.orderId,
    //     method:'GET',
    //     success:res=>{
    //         if(res.data.data == "交易成功" || res.data.data=="交易已经完成"){
    //           wx.request({
    //             url: app.url.url + '/pay/pay/success',
    //             method:'POST',
    //             header:{
    //               "Content-Type":"application/json"
    //             },
    //             data:{
    //               "userId":that.data.user.userId,
    //               "orderId":that.data.orderId
    //             },
    //             success:res=>{
    //               clearInterval(times);
    //               wx.redirectTo({
    //                 url: '../moneyInfo/index',
    //               })
    //             }
    //           })
    //         }
    //     }
    //   })
    // },10000)
  },

  check(){
    let that=this;
    console.log(that.data.orderId);
    // 检查订单情况
    wx.request({
      url: app.url.url + '/pay/order/status/'+that.data.orderId,
      method:'GET',
      success:res=>{
        console.log(res);
        //调用交易成功的接口
          if(res.data.data == "交易成功" || res.data.data=="交易已经完成"){
            wx.request({
              url: app.url.url + '/pay/pay/success',
              method:'POST',
              header:{
                "Content-Type":"application/json"
              },
              data:{
                "userId":that.data.user.userId,
                "orderId":that.data.orderId
              },
              success:res=>{
                if(res.data.data == "交易成功" || res.data.data=="交易已经完成"){
                  wx.redirectTo({
                    url: '../moneyInfo/index',
                  })
                }
              }
            })
          }
      }
    })
  },

  // 取消订单
  pass(){
    let that=this;
    // 检查订单信息
    wx.request({
      url: app.url.url + '/pay/order/status/'+that.data.orderId,
      method:'GET',
      success:res=>{
        // 交易成功的处理
          if(res.data.data == "交易成功" || res.data.data=="交易已经完成"){
            wx.request({
              url: app.url.url + '/pay/pay/success',
              method:'POST',
              header:{
                "Content-Type":"application/json"
              },
              data:{
                "userId":that.data.user.userId,
                "orderId":that.data.orderId
              },
              success:res=>{
                wx.showToast({
                  title: '交易成功',
                  icon:"success",
                  success:res=>{
                    wx.redirectTo({
                      url: '../moneyInfo/index',
                    })
                  }
                })
              }
            })
          }else{
            // 取消订单的处理
            wx.request({
              url: app.url.url + '/pay/pay/notPay',
              method:'POST',
              header:{
                "Content-Type":"application/json"
              },
              data:{
                "userId":that.data.user.userId,
                "orderId":that.data.orderId
              },
              success:res=>{
                wx.redirectTo({
                  url: '../moneyInfo/index',
                })
              }
            })
          }
      }
    })
  },

})