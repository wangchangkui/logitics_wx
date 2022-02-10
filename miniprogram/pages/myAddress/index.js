// pages/myAddress/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    allAddress:[]
  },

  edit(i){
    wx.redirectTo({
      url: '../addAddress/index?id='+i.target.dataset.id,
    })
  },

  delete(event){
  
    wx.request({
      url: 'http://localhost:8080/user/deleteAddress',
      method: "POST",
      data:{
        "id": event.target.dataset.id
      },
      header:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      success:res=>{
        if(res.data.code==200000){
          wx.redirectTo({
            url: '../myAddress/index',
          })
        }
      }
    })
  },

  onClickRight(){
    wx.redirectTo({
      url: '../addAddress/index',
    })
  },
  
  isCheck(event){
    let temp=event.target.dataset.id+"";
    let tempArr=temp.split(",");
    wx.request({
      url: 'http://localhost:8080/user/setCheck',
      method: "POST",
      data:{
        "id": tempArr[0],
        "userId":tempArr[1]
      },
      header:{
        "Content-Type":"application/x-www-form-urlencoded"
      },
      success:res=>{
        if(res.data.code==200000){
          wx.redirectTo({
            url: '../myAddress/index',
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    if(this.data.address.username == undefined){
      let user=wx.getStorageSync('user');
      if(user.userid == undefined){
        wx.redirectTo({
          url: '../login/index',
        })
      }
      wx.request({
        url: 'http://localhost:8080/user/addressList/'+user.userid,
        method: "get",
        success:res=>{
          let temp;
          let tempArray=new Array();
          for(let i=0;i<res.data.data.length;i++){
            if(res.data.data[i].isCheck==1){
              temp=res.data.data[i];
            }else{
              tempArray.push(res.data.data[i]);
            }
          }
          that.setData({
            address:temp,
            allAddress:tempArray
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