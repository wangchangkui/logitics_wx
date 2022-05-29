// pages/my/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
  },
  onClickLeft:function(){
    wx.switchTab({
      url: '../me/me',
    })
  },

  checkUser() {
    wx.redirectTo({
      url: '../checkCard/index',
    })
  },

  exit(){
    wx.setStorageSync('user', null);
    wx.switchTab({
      url: '../index/index',
    })
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
  chageInfo:function(){
    wx.redirectTo({
      url: '../chageInfo/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    let login = wx.getStorageSync('user')
    
    that.setData({
      user:login
    })
    if(login.username == undefined){
      wx.redirectTo({
        url: '../login/index',
      })
    }
    wx.request({
      url: app.url.url +'/user/getUser',
      method: 'POST',
      header:{
        "Content-Type":"application/x-www-form-urlencoded",
      },
      data:{
        "openId":login.userId
      },
      success:res=>{
        console.log(res);
        this.setData({
          user:res.data.data
        })
      }
    })
   
  },

})