// pages/myArre/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:null
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
    let user=wx.getStorageSync('user');
    wx.request({
      url: 'http://localhost:8080/user/arrea/'+user.userid,
      method:'GET',
      success:res=>{
        that.setData({
          orders:res.data.data
        })
      }
    })
  },

  getOrder(event){
    let that=this;
   let aid= event.currentTarget.dataset.id
    wx.request({
      url: 'http://localhost:8080/user/userArr/'+aid,
      method:'GET',
      success:res=>{
        if(res.data.code == 400004){
          wx.showToast({
            title: '余额不足',
            icon:'error',
          })
        }else{
          wx.showToast({
            title: '支付成功',
            icon:'success',
            success:res=>{
              that.onShow();
            }
          })
        }
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