// pages/onlineOrder/index.js

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order:[],
    option1: [
      { text: '全部订单', value: 0 },
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
    show:false
  },
  getOrder(event){
    //先验证有没有登录
    let user=wx.getStorageSync('user');

    if(user.userid == undefined ){
      wx.redirectTo({
        url: '../login/index',
      })
    }

    wx.request({
      url: 'http://localhost:8080/order/getOrder',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        orderId:event.currentTarget.dataset.id,
        userid:user.userid,
        address:event.currentTarget.dataset.goodsAddress
      },
      success:res=>{
        if(res.data.code==200000){
          Dialog.alert({
            title: '消息',
            message: '抢单成功,请在我的订单查看',
          }).then(() => {
            // 刷新页面
            wx.redirectTo({
              url: '../myOrder/index',
            })
          });
        }else{
          Dialog.alert({
            title: '消息',
            message: res.data.message,
          }).then(() => {
          });
        }
      }
    })
  },
  bind(event){
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
      url: 'http://localhost:8080/order/condition',
      method:'POST',
      header:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data:{
        v1:that.data.value1,
        v2:that.data.value2
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    // 这里需要修改 但是我不想改了
    wx.request({
      url: 'http://localhost:8080/order/orderList/1/50',
      method:'GET',
      success:res=>{
        if(res.data.code==200000){
          console.log(res.data)
          that.setData({
            order:res.data.data.records
          })
        }else{
          that.setData({
            order:null
          })
        }
      },
      fail:fail=>{
        that.setData({
          show:true
        })
      }
    })
  },

})