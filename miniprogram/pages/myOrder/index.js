// pages/myOrder/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    user:null,
    steps: [
      {
        text: '发布订单'
      },
      {
        text: '接受订单'
      },
      {
        text: '完成订单'
      },
      {
        text: '确认完成'
      },
    ],
  },

  mytap(event){
    
    let that=this;
    wx.request({
      url: app.url.url + '/order/getUserOrder',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        "userId":that.data.user.userId,
        "type":event.detail.index
      },
      success:res=>{
        that.makeStep(res);
        // that.setData({
        //   order:res.data.data
        // })
      }
    })
  },
  makeStep(res){
    let temp =new Array();
    for(let i=0; i<res.data.data.length;i++){
      let order = res.data.data[i];
      if(order.status < 3){
        order.active = order.status - 1;
      }else if(order.status == 5){
        order.active = 3;
      }else if(order.status == 6){
        order.active = 2;
      }else if(order.status == 3 || order.status == 4){
        order.active = -1;
      }
      temp.push(order)
    }
    this.setData({
      order:temp
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let user=wx.getStorageSync('user');
    console.log(user)
    if(user.userId == undefined){
      wx.redirectTo({
        url: '../login/index',
      })
    }
    let type = 0;
    wx.request({
      url: app.url.url + 'order/getUserOrder',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        "userId":user.userId,
        "type":type
      },
      success:res=>{
        console.log(res.data.data)
        if(res.data.data){
          console.log(res.data)
          let temp =new Array();
          for(let i=0; i<res.data.data.length;i++){
            let order = res.data.data[i];
            if(order.status < 3){
              order.active = order.status - 1;
            }else if(order.status == 5){
              order.active = 3;
            }else if(order.status == 6){
              order.active = 2;
            }else if(order.status == 3 || order.status == 4){
              order.active = -1;
            }
            temp.push(order)
          }
          console.log(temp);
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
    Dialog.confirm({
      title: '消息',
      message: '确认完成订单',
    }).then(() => {
      // 刷新页面
      wx.request({
        url: app.url.url + '/order/confirm',
        method:'POST',
        data:{
          userId:that.data.user.userId,
          orderId:event.currentTarget.dataset.id
        },
        header:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        success:res=>{
          Dialog.alert({
            title: '等待确认完成',
            message: '顾主确认支付后完成订单',
          }).then(() => {
            that.onLoad();
          });
        },
        fail:err=>{
          console.log(err);
          wx.showToast({
            title: eer,
          })
        }
      })
    })
    .catch(() => {
      // on cancel
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