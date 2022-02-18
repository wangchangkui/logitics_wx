import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    user: {},
    actions: [],
    address: "",
    money: 0,
    phone: "",
    getCode: "",
    name: ""
  },
  check() {
    let that = this;
    // 数据验证
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    let money= /^([1-9][0-9]*)+(\.[0-9]{1,2})?$/;
    if (!reg.test(that.data.phone) || that.data.phone.length == 0 || that.data.phone == "") {
      wx.showToast({
        title: '手机号错误',
        icon: "error"
      })
    } 
    else if (that.data.address.length == 0 || that.data.address == "" || that.data.getCode.length == 0 || that.data.getCode == "" || that.data.name == "" || that.data.name.length == 0) 
    {
      wx.showToast({
        title: '订单数据不完整',
        icon: "error"
      })
    }
    else if(!money.test(that.data.money) || that.data.money == 0 ){
      wx.showToast({
        title: '金额不正确',
        icon: "error"
      })
    }else{
      // 满足条件的时候 提交订单
      wx.request({
        url: 'http://localhost:8080/order/createOrder',
        method:'POST',
        header:{
          "Content-Type":"application/json"
        },
        data:{
          "userId":that.data.user.userid,
          "goodsName":"取快递",
          "code":that.data.getCode,
          "money":that.data.money,
          "phone":that.data.phone,
          "address":that.data.address,
          "userName":that.data.name
        },
        success:res=>{
          if(res.data.code==200000){
            Dialog.alert({
              title: '消息',
              message: res.data.data,
            }).then(() => {
              wx.switchTab({
                url: '../index/index',
              })
            });
          }else{
            Dialog.alert({
              title: '消息',
              message: res.data.message,
            }).then(() => {
              // on close
            });
          }
        }
      })
    }
    
  },
  selectAddress() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },

  onSelect(option) {
    this.setData({
      address: option.detail.subname,
      phone: option.detail.phone,
      name: option.detail.username
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let users = wx.getStorageSync('user');
    let that = this;
    wx.request({
      url: 'http://localhost:8080/user/addressList/' + users.userid,
      method: "GET",
      success: res => {
        if (res.data.code == 200000) {
          let datas = new Array();
          if( res.data.data.length == 0){
            Dialog.alert({
              title: '消息',
              message: '请先增加一个地址',
            }).then(() => {
              // 刷新页面
              wx.redirectTo({
                url: '../addAddress/index',
              })
            });
          }
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].isCheck == 1) {
              that.setData({
                address: res.data.data[i].address,
                name: res.data.data[i].username,
                phone: res.data.data[i].phone
              })
            }  
            let obj = {
                name: res.data.data[i].username + " " + res.data.data[i].phone,
                phone: res.data.data[i].phone,
                subname: res.data.data[i].address,
                username: res.data.data[i].username
             }
              datas.push(obj); 
          }
          that.setData({
            actions: datas,
            user:users
          })
        } else {
          wx.redirectTo({
            url: '../login/index',
          })
        }
      }
    })

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