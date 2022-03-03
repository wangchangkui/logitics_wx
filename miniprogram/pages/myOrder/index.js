// pages/myOrder/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    user:null
  },

  mytap(event){

    let that=this;
    wx.request({
      url: 'http://localhost:8080/order/getUserOrder',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        userId:that.data.user.userid,
        type:event.detail.index
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
    let that=this;
    let user=wx.getStorageSync('user');
    console.log(user)
    if(user.userid == undefined){
      wx.redirectTo({
        url: '../login/index',
      })
    }
    wx.request({
      url: 'http://localhost:8080/order/getUserOrder',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        userId:user.userid,
        type:0
      },
      success:res=>{
        console.log(res.data.data)
        if(res.data.data){
          console.log(res.data)
          let temp =new Array();
          for(let i=0; i<res.data.data.length;i++){
            temp.push(res.data.data[i])
          }
          that.setData({
            order:temp,
            user:user
          })
        }
      }
    })
  },

  over(event){
    let that=this;
    Dialog.alert({
      title: '消息',
      message: '确认完成订单',
    }).then(() => {
      // 刷新页面
      wx.request({
        url: 'http://localhost:8080/order/confirm',
        method:'POST',
        data:{
          userId:that.data.user.userid,
          orderId:event.currentTarget.dataset.id
        },
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        success:res=>{
          that.onLoad();
        }
      })
    });
    
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