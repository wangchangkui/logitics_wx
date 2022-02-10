// pages/checkCard/index.js

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    card:"",
    fileList: [],
  },
  afterRead(event) {
    let temp=this.data.fileList;
    let file=event.detail.file;
    file.deletable=true;
    temp.push(file)
    this.setData({
      fileList:temp
    })
  },

  delete(event){
    let temp=this.data.fileList;
    temp.splice(event.detail.index,1);
    this.setData({
      fileList:temp
    })
  },
  onClickLeft: function () {
    wx.redirectTo({
      url: '../my/index',
    })
  },

  check(){
    let that=this;
    var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if(!idcardReg.test(this.data.card)){
      Toast('身份证不正确');
    }else{
      // 上传文件
      let promiseArr=[];
      for(let i=0;i<that.data.fileList.length;i++){
        console.log(that.data.fileList[i].url)
        promiseArr.push(new Promise((reslove,reject)=>{
          wx.uploadFile({
            filePath: that.data.fileList[i].url,
            name: 'file',
            url: 'http://localhost:8080/user/upload/check',
            success:res=>{
              let json=JSON.parse(res.data)
              reslove(json.data)
            }
          })
        }))
      }
      Promise.all(promiseArr).then(res=>{
        console.log(res)
      })

    }
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