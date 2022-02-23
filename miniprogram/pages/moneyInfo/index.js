// pages/moneyInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    orders:[]
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
    let loginUser=wx.getStorageSync('user');
    if(loginUser.userid != undefined || user.userid != ""){
      wx.request({
        url: 'http://localhost:8080/user/getUser',
        method:'POST',
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        data:{
          openId:loginUser.userid
        },
        success:res=>{
          console.log(res)
          that.setData({
            user:res.data.data
          })
        }
      })

      wx.request({
        url: 'http://localhost:8080/user/arreInfo/'+loginUser.userid,
        method:'GET',
        success:res=>{
          let arr=that.data.orders;
          for(let i=0;i<res.data.data.length;i++){
            arr.push(res.data.data[i]);
          }
          that.setData({
            orders:arr
          })
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