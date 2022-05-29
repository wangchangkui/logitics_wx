// pages/myAddress/index.js
import { request } from "../../request/request"
import regeneratorRuntime from '../../lib/runtime/runtime'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    allAddress:[]
  },

  edit(i){
    console.log(i.target.dataset.id);
    wx.redirectTo({
      url: '../addAddress/index?id='+i.target.dataset.id,
    })
  },

  deleteAddress(id){
    //promis 防止回调 
    let that=this;
    request({url:"/user/deleteAddress",method:"post",data:{"userId":id}})
    .then(res =>{
      console.log(res);
      that.onLoad();
      // wx.redirectTo({
      //   url: '../myAddress/index',
      // })
    });
  },

  delete(event){
    this.deleteAddress(event.target.dataset.id);
  },

  onClickRight(){
    wx.redirectTo({
      url: '../addAddress/index',
    })
  },
  
  isCheck(event){
    let temp=event.target.dataset.id+"";
    let tempArr=temp.split(",");
    console.log(tempArr);
    this.setCheck({"id": tempArr[0],"userId":tempArr[1]
    });
  },

  setCheck(data){
    let that = this;
    request({
      header:{"Content-Type":"application/x-www-form-urlencoded"},
      url:"/user/setCheck",
      method:"post",
      data:data})
    .then(res =>{
      console.log(res);
      wx.redirectTo({
        url: '../myAddress/index',
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    console.log(this);
    console.log(options);

    var user = wx.getStorageSync('user')
    console.log(user);

    if(user == undefined || user == null || user.userId == undefined || user.userId == null ){
      wx.redirectTo({
          url: '../login/index',
        })
    }else{
      that.addressList(user.userId);
    }
    // if(this.data.address.username == undefined){
    //   let user=wx.getStorageSync('user');
    //   if(user.userid == undefined){
        
    //   }
      
    // }
  },
  //获取地址列表
  addressList(userid){
    //promis 防止回调 
    let that=this;
    request({url:"/user/addressList/"+userid,method:"get"})
    .then(res =>{
      let temp;
      let tempArray=new Array();
      console.log(res);
      for(let i=0;i<res.length;i++){
        if(res[i].isCheck==1){
          temp=res[i];
        }else{
          tempArray.push(res[i]);
        }
      }
      that.setData({
        address:temp,
        allAddress:tempArray
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

  onClickLeft(){
    wx.navigateBack({
      delta: 0,
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