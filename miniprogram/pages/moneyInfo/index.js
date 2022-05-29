// pages/moneyInfo/index.js
const app = getApp();


Date.prototype.format = function (formatStr) {
  var str = formatStr;
  var Week = ['日', '一', '二', '三', '四', '五', '六'];
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
  str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
  return str;
}
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    orders: [],
    show: false,
    shows: false,
    tx: 1,
    txi: null
  },


  confirm() {
    let that = this;
    if (this.data.tx > this.data.user.decimals) {
      wx.showToast({
        title: '超过现有金额',
        icon: "error"
      })
    } else {
      if (that.data.user.phone == "" || that.data.user.phone == null) {
        wx.showToast({
          title: '未绑定手机号',
          icon: "error"
        })
        return;
      }
      wx.request({
        url: app.url.url + '/tx/insertTx',
        method: 'POST',
        header: {
          "Context-Type": "application/json"
        },
        data: {
          userId: this.data.user.userId,
          money: that.data.tx,
          aliPay: that.data.user.phone,
        },
        success: res => {
          Dialog.alert({
            title: '成功',
            message: '提现审核中',
          }).then(() => {
            // on close
            this.onShow();
          });
        }
      })
    }
  },

  tx() {
    this.setData({
      show: true
    });
  },

  moneyInfo() {
    let that=this;
    wx.request({
      url: app.url.url + '/pay/pay/onlineOrder/' + that.data.user.userId,
      method: 'GET',
      success: res => {
        console.log(res)
        // 如果没有数据说明没有当前的订单
        if (res.data.data.orderId != null) {
          Dialog.alert({
            title: '成功',
            message: '你还有未支付的订单',
          }).then(() => {
            wx.navigateTo({
              url: '../waitPay/index?img=' + res.data.data.image + "&orderId=" + res.data.data.orderId,
            })
          });
        } else {
          this.setData({
            shows: true
          });
        }
      }
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  onClose2() {
    this.setData({
      shows: false
    });
  },

  confirm2() {
    let that = this;
    if (that.data.txi > 0) {
      wx.request({
        url: app.url.url + '/pay/pay/onlineOrder/' + that.data.user.userId,
        method: 'GET',
        success: res => {
          // 如果没有数据说明没有当前的订单
          if (res.data.data.orderId == null) {
            wx.request({
              url: app.url.url + '/pay/onlinePay',
              method:'POST',
              header:{
                "Content-Type":"application/json"
              },
              data:{
                userId:that.data.user.userId,
                userName:that.data.user.username,
                money:that.data.txi,
                phone:that.data.user.phone
              },
              success:res=>{
                wx.setStorageSync('time', 30*30*1200)
                if(res.data.data.image){
                  wx.navigateTo({
                    url: '../waitPay/index?img=' + res.data.data.image +"&orderid=" +res.data.data.orderId,
                  })
                }
                console.log(res)
              }
            })
          } else {
            console.log(res.data.data)
            Dialog.alert({
              title: '成功',
              message: '你还有未支付的订单',
            }).then(() => {
              wx.navigateTo({
                url: '../waitPay/index?img=' + res.data.data.image + "&orderid=" + res.data.data.orderId,
              })
            });
          }
        }
      })
    } else {
      wx.showToast({
        title: '金额不正确',
        icon: 'error'
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
    let that = this;
    let loginUser = wx.getStorageSync('user');
    console.log(loginUser);
    // 加载用户的金额接口
    if (loginUser != undefined && loginUser != null && loginUser.userId != undefined && loginUser.userId != null) {
      wx.request({
        url: app.url.url + '/user/getUser',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          openId: loginUser.userId
        },
        success: res => {
          if(res.data.data != null){
            loginUser = res.data.data;
          }
          console.log(loginUser);
          that.setData({
            user: loginUser
          })
        }
      })
    }
    // if( this.data.user != null && this.data.user != undefined && this.data.user.userId != null){
      console.log(loginUser);
      // 获取用户的欠费信息接口
      wx.request({
        url: app.url.url + '/user/arreInfo/' + loginUser.userId,
        method: 'GET',
        success: res => {
          let arr = that.data.orders;
          for (let i = 0; i < res.data.data.length; i++) {
            arr.push(res.data.data[i]);
          }
          that.setData({
            orders: arr
          })
        }
      })
    // }
  },
})