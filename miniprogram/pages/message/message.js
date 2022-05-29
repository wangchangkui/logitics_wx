// miniprogram/pages/message/message.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const app = getApp();

var socket;

Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


Page({
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({
      active: event.detail
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    people: 18,
    websocket: null,
    user: {
      "userId": "oYxOB5YFXmYZWH8R6YCE_wqBDZk0"
    },
    message: [],
    messages:"",
    bottom:"mes-0",
    current:1,
    show: true,
  },
  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
    this.connectWebScoket(wx.getStorageSync("user"));
    let that=this;
    wx.request({
      url: app.url.url + '/websocket/getMessage',
      method:'Post',
      header:{
        "Content-Type":"application/json"
      },
      data:{
        "entity":{

        },
        "page":{
            "size":100,
            "current":that.data.current
        }
    },
    success:res=>{
     that.setData({
       message:res.data.data.records,
       bottom:"mes-"+(res.data.data.records.length-1)
     })
    }
    })

    // 这里是心跳机制的监测
    let loginUser = wx.getStorageSync('user');
    
    // this.connectWebScoket(loginUser);
    setInterval(function(){
      if(undefined == loginUser || undefined == loginUser.userId){
        return;
      }
      let data={
        "userId":loginUser.userId,
        "content":"ping",
        "pic":loginUser.headerImage,
        "nickName":loginUser.username,
        "createTime":new Date().Format("yyyy-MM-dd HH:mm:ss")
      };
      let str=JSON.stringify(data);
      wx.sendSocketMessage({
        data: str,
      })
    },300000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.onShow();
  },

 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().init();
    let loginUser = wx.getStorageSync('user');
    let that = this;
    if (loginUser.userId == undefined) {
      wx.redirectTo({
        url: '../login/index',
      })
    } else {
      // 设置用户信息
      that.setData({
        user: loginUser,
        bottom: "mes-"+(that.data.message.length-1)
      });
      // that.connectWebScoket(loginUser);

      wx.request({
        url: app.url.url + '/websocket/online',
        method:'GET',
        success:res=>{
          that.setData({
            people:res.data.data+1
          })
        }
      })
    }
  },


  connectWebScoket(loginUser){
    let that=this;
    let username = encodeURIComponent(loginUser.username);
    let url = app.url.websocket + '/live?id=' + loginUser.userId + "&userName=" + username;
    console.log(url);
    socket=wx.connectSocket({
      url: url,
      success: res => {
        that.setData({
          websocket:socket,
          show:false
        })
        console.log("websocket连接成功")
      },
      fail:fail=>{
        Dialog.alert({
          title: '消息',
          message: "服务器连接失败，请联系管理员",
        }).then(() => {
          // 调用连接失败的接口保存日志信息
          console.log(fail)
        });
      }
    });
    this.initSocket();
  },

  // initSocket(){
  //   let that = this;
  //   let loginUser = wx.getStorageSync('user');

  //   let socketOpen = false
  //   let socketMsgQueue = []
  //   let socket = wx.connectSocket({
  //     url: app.url.websocket + '/live?id=' + loginUser.userId + "&userName=" + loginUser.username,
  //   })
  //   socket.onOpen(()=>{
  //     console.log("webSocket连接打开");
  //   });
  //   socket.onMessage((result)=>{
  //       let mes=JSON.parse(result.data);
  //       // that.data.message.push(mes);
  //       let es=this.data.message;
  //       es.push(mes);
  //       console.log(mes);
  //       this.setData({
  //         message:es,
  //         bottom:"mes-"+(es.length-1)
  //       })
  //   })
  // },



  initSocket(){
    let that = this;
    wx.onSocketOpen((result) => {
      console.log("webSocket连接打开");
    })

    wx.onSocketClose((result) => {
      console.log("webSocket已经关闭",result);
      this.setData({
        show:true
      })
      // 重连
      this.connectWebScoket(this.data.user);
    })

    wx.onSocketError((result) => {
      console.log("webSocket出现异常",result);
      this.setData({
        show:true
      })
      // 重连
      this.connectWebScoket(this.data.user);
    })

    wx.onSocketMessage((result) => {
      if(result.data=="pong"){
        console.log("心跳监测正常")
      }else{
        let mes=JSON.parse(result.data);
        let es=this.data.message;
        es.push(mes);
        console.log(mes);
        this.setData({
          message:es,
          bottom:"mes-"+(es.length-1)
        })
      }
    })
  },


  sendM(){
    let that=this;
    if(that.data.messages !=""){
      let data={
        "userId":that.data.user.userId,
        "content":that.data.messages,
        "pic":that.data.user.headerImage,
        "nickName":that.data.user.username,
        "createTime":new Date().Format("yyyy-MM-dd HH:mm:ss")
      };
      console.log(data);
      let str=JSON.stringify(data);
        wx.sendSocketMessage({
          data: str,
          success:res=>{
            let mes=that.data.message;
            mes.push(data);
            that.setData({
              message:mes,
              messages:"",
              bottom:"mes-"+(mes.length-1)
            })
          }
        })
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