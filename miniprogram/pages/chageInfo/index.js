// pages/chageInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    fileList: [{
      url: 'http://iph.href.lu/60x60?text=default',
      name: '图片1',
      isImage: true,
      deletable: true,
    }],
    name: "",
    phone: "",
    sex: "",
    address: "",
    time: 0,
    sms: ""
  },

  afterRead(event) {
    let fileLists = [{
      url: event.detail.file.url,
      name: '图片1',
      isImage: true,
      deletable: true,
    }];

    this.setData({
      fileList: fileLists
    })
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
    let login = wx.getStorageSync('user')
    if (login.username == undefined) {
      wx.redirectTo({
        url: '../login/index',
      })
    }
    let fileLists = [{
      url: login.headerImage,
      name: '图片1',
      isImage: true,
      deletable: true,
    }];
    this.setData({
      user: login,
      fileList: fileLists,
      name: login.username,
      phone: login.phone,
      sex: login.sex == 1 ? "男" : "女",
      address: login.address,
    })
  },

  check: function () {
    let that = this;
    console.log(that.data.user)
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
    if (that.data.phone == "" || that.data.phone.length < 0 || that.data.phone.length > 11 || !reg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'error'
      })
    }  else {
      let userId = that.data.user.userid;
      let path = "";
      let code = 0;
      new Promise((resolve, reject) => {
        wx.uploadFile({
          filePath: that.data.fileList[0].url,
          name: 'file',
          url: 'http://localhost:8080/user/upload',
          formData: {
            "userId": userId
          },
          // 如果成功 则更新新的值
          success: res => {
            let rs = JSON.parse(res.data);
            if (rs.code == 200000) {
              path = rs.data;
              code = 1;
              resolve(path, code);
            }
          },
          //如果失败 设置默认的值
          fail: fail => {
            resolve(that.data.user.headerImage)
          }
        })
      }).then(value => {
      
        let users = {
          headerImage: value,
          username: that.data.name,
          sex: that.data.sex == "男" ? 1 : 0,
          phone: that.data.phone,
          address: that.data.address,
          userid: that.data.user.userid,
        }
        // 这里我需要发送到服务器更新用户
        wx.request({
          url: 'http://localhost:8080/user/uploadUser',
          method:"POST",
          data:users,
          header:{
            "content-type": "application/json; charset=UTF-8"
          },
          success:res=>{
            if(res.data.code==200000){
              wx.showToast({
                title: '更新成功',
                icon: 'sussess',
                success:res=>{
                  wx.setStorageSync('user', users);
                  wx.redirectTo({
                    url: '../my/index',
                  })
                }
              })
            }
            else{
              wx.showToast({
                title: '更新失败',
                icon: 'error'
              })
            }
          }
        })
      })
    }
  },



  onClickLeft: function () {
    wx.redirectTo({
      url: '../my/index',
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