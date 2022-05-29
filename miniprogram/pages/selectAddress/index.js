// pages/selectAddress/index.js
const app = getApp();

import data from '../getGoods/data'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    allAddress: []
  },

  isCheck(event){
    for(let i=0;i<this.data.allAddress.length;i++){
      if(this.data.allAddress[i].id==event.currentTarget.dataset.id){
        data.address=this.data.allAddress[i].businessAddress
        wx.redirectTo({
          url: '../getGoods/index?data='+data.address
        })
      }
    }
  },

  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  onSearch() {
   
  },
  onClick() {
    let that=this;
    wx.request({
      url: app.url.url + '/business/businessList',
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      data: {
        "entity": {
          "businessAddress":that.data.value
        },
        "page": {
          "size":-1,
          "current": 1
        }
      },
      success:res=>{
        if(res.data.data.records){
          console.log(res.data.data.records)
          that.setData({
            allAddress:res.data.data.records
          })
        }
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
    wx.request({
      url: app.url.url + '/business/businessList',
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      data: {
        "entity": {
        },
        "page": {
          "size":20,
          "current": 1
        }
      },
      success:res=>{
        if(res.data.data.records){
          that.setData({
            allAddress:res.data.data.records
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