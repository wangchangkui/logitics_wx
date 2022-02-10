// pages/addAddress/index.js
import { areaList } from '@vant/area-data';

Page({



  /**
   * 页面的初始数据
   */
  data: {
    areaList:areaList,
    address:"",
    phone:"",
    reslut:"",
    username:"",
    check:0,
    id:""
  },
  

  onChange(event){
    this.setData({
      check:event.detail
    })
  },
  onClickRight(){
    let that=this;
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if(!reg.test(that.data.phone) || that.data.phone==""){
      wx.showToast({
        title: '手机号错误',
        icon:"error"
      })
    }
    else if( that.data.address==""){
      wx.showToast({
        title: '详细地址不能为空',
        icon:"error"
      })
    }
    else if(that.data.username==""){
      wx.showToast({
        title: '用户名不能为空',
        icon:"error"
      })
    }else{

      // 构造地址信息
      let temp=that.data.reslut+that.data.address;
      
      let addressTemp={
        userId:wx.getStorageSync('user').userid,
        address:temp,
        isCheck:that.data.check,
        username:that.data.username,
        phone:that.data.phone,
        id:that.data.id
      };
      wx.request({
        url: 'http://localhost:8080/user/saveOrInsert',
        method:"POST",
        header:{
          "content-type": "application/json; charset=UTF-8"
        },
        data:addressTemp,
        success:res=>{
          wx.redirectTo({
            url: '../myAddress/index',
          })
        }
      })
    }
  },
  onClickLeft(){
    wx.redirectTo({
      url: '../myAddress/index',
    })
  },

  confirm(event){
    let temp=event.detail.values;
    let str="";
    for(let i=0;i<temp.length;i++){
      if(temp[i] != undefined){
        if(temp[i].code != undefined || temp[i].code!=""  ){
          str+=temp[i].name
        }
      }
    }
    this.setData({
      reslut:str
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    let that=this;
    if(options.id != undefined){
      wx.request({
        url: 'http://localhost:8080/user/getAddressById',
        method:"get",
        data:{
          id:options.id
        },
        success:res=>{
          that.setData({
            address:res.data.data.address,
            id:res.data.data.id,
            username:res.data.data.username,
            check:0,
            phone:res.data.data.phone
          })
        }
      })
    }
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
    wx.request({
      url: 'url',
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