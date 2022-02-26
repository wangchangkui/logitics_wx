// pages/txPage/index.js
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
    wx.request({
      url: 'http://localhost:8080/tx/selectTx',
      method:'POST',
      header:{
        "Content-Type":"application/json"
      },
      data:{
        "entity":{
          "userId":user.userid
        },
        "page":{
          "size":-1,
          "current":0
      }
      },
      success:res=>{
        console.log(res)
        that.setData({
          order:res.data.records
        })
      }
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