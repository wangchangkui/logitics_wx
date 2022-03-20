// pages/payList/index.js
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
   if(user.userid == '' || user.userid == undefined){
     wx.redirectTo({
       url: '../login/index',
     })
   }else{
    wx.request({
      url: 'http://localhost:8080/pay/user/'+user.userid,
      method:'GET',
      success:res=>{
        console.log(res)
        if(res.data.data){
          if(res.data.data.length>0){
            that.setData({
              order:res.data.data
            })
          }
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