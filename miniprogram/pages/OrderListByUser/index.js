// pages/OrderListByUser/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:null,
    option1: [
      { text: '全部订单', value: 0 },
      { text: '正在进行的订单', value: 1 },
      { text: '已完成的订单', value: 2 },
    ],
    option2: [
      { text: '默认排序', value: 'a' },
      { text: '发布时间升序排序', value: 'b' },
      { text: '发布时间降序排序', value: 'd' },
      { text: '订单金额升序排序', value: 'c' },
      { text: '订单金额降序排序', value: 'e' },
    ],
    value1: 0,
    value2: 'a',
  },


  // 取消订单的操作
  getOrder(event){
    let user=wx.getStorageSync('user');
    wx.request({
      url: 'http://localhost:8080/order/cancelOrder',
      method:'POST',
      header:{
        "Content-Type":"application/json"
      },
      data:{
        userId:user.userid,
        orderId:event.target.dataset.id
      },
      success:res=>{
        this.onShow();
      }
    })
  },

  // 页面排序操作
  bind(event){
   let user = wx.getStorageSync('user');
    let that=this;
    if(event.currentTarget.dataset.id=="a"){
      that.setData({
        value2:event.detail
      })
    }
    if(event.currentTarget.dataset.id==0){
      that.setData({
        value1:event.detail
      })
    }
    wx.request({
      url: 'http://localhost:8080/order/conditionByUser',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        v1:that.data.value1,
        v2:that.data.value2,
        userId:user.userid
      },
      success:res=>{
        that.setData({
          order:res.data.data
        })
      }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    //先验证有没有登录
    let user=wx.getStorageSync('user');
    if(user.id == undefined){
      wx.redirectTo({
        url: '../login/index',
      })
    }
    wx.request({
      url: 'http://localhost:8080/order/getOrderUser/'+user.userid,
      method:'GET',
      success:res=>{
        console.log(res)
        that.setData({
          order:res.data.data
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