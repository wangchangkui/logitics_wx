// pages/webSocket/webSocket.js

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
    current:1
  },

  webSocketManange(){
    let that = this;
    let loginUser = wx.getStorageSync('user');

    let socketOpen = false
    let socketMsgQueue = []
    let socket = wx.connectSocket({
      url: app.url.websocket + '/live?id=' + loginUser.userId + "&userName=" + loginUser.username,
    })
    socket.onOpen(()=>{
      console.log("webSocket连接打开");
    });
    socket.onMessage((result)=>{
        let mes=JSON.parse(result.data);
        // that.data.message.push(mes);
        let es=this.data.message;
        es.push(mes);
        console.log(mes);
        this.setData({
          message:es,
          bottom:"mes-"+(es.length-1)
        })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.webSocketManange();
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