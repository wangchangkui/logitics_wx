import { request } from "../../request/request"
// import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime'

// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lbt:[],
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

  //获取轮播图数据的代码
  getSwiperList(){
    //promis 防止回调 
    let that=this;
    request({url:"/index/lbt",method:"get"})
    .then(result =>{
      console.log(result);
      // var temp=[];
      // for(let i=0;i<result.length;i++){
      //   temp[i]=result[i].headerUrl;
      // }
      that.setData({
        lbt:result
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    let that=this;
    if(that.data.lbt.length==0){
      that.getSwiperList();
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