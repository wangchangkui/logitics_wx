// pages/payList/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    order:null,
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
  let that=this;
   let user = wx.getStorageSync('user');
   if(user.userId == '' || user.userId == undefined || user.userId== null){
     wx.redirectTo({
       url: '../login/index',
     })
   }else{
    wx.request({
      url: app.url.url + '/pay/user/'+user.userId,
      method:'GET',
      success:res=>{
        console.log(res)
        if(res.data.data){
          that.setData({
            order:res.data.data
          })
        }
      }
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