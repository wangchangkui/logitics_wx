// pages/notice/notice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let noticeId = options.noticeId;
    if(noticeId != undefined && noticeId != null){
      let that = this;
      wx.request({
        url: app.url.url + '/notice/noticeById/'+noticeId,
        method:'POST',
        header:{
          "Content-Type":"application/json"
        },
        success:res=>{
          console.log(res);
          that.setData({
            notice:res.data.data
          });
  
        }
      })
    }
    
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