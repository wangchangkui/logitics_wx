// pages/myArre/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:null,
    show:false
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
      url: app .url.url + '/user/arrea/'+user.userid,
      method:'GET',
      success:res=>{
        if(res.data.data.length>0){
          that.setData({
            orders:res.data.data,
            show:false
          })
        }
      }
    })
  },

  getOrder(event){
    let that=this;
   let aid= event.currentTarget.dataset.id
    wx.request({
      url: app.url.url + '/user/userArr/'+aid,
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
})