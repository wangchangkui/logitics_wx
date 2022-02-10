// pages/my/index.js
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
    let login = wx.getStorageSync('user')
    if(login.username == undefined){
      wx.redirectTo({
        url: '../login/index',
      })
    }
    this.setData({
      user:login
    })
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