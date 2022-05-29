// pages/feedback/index.js
import Toast from '/@vant/weapp/toast/toast';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio:0,
    chooseImages:[],
    textVal:"",
    title:'',
    file:""

  },
  onChange(event){
    this.setData({
      radio:event.detail
    })
    console.log(this.data.radio);
  },
  FILE:"",
  // 外网图片路径地址
  UpLoadImgs:[],
  //检查权限
 checkAuth(gotc) {
  //查询权限
  wx.showLoading({
    title: '检查授权情况',
    mask: true
  })
  wx.getSetting({
    success(res) {
      wx.hideLoading();
      if (!res.authSetting['scope.writePhotosAlbum']) {
        //请求授权
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            //获得授权，开始下载
            gotc && gotc();
          },
          fail() {
            wx.showModal({
              title: '',
              content: '保存到系统相册需要授权',
              confirmText: '授权',
              success(res) {
                if (res.confirm) {
                  wx.openSetting({
                    success(res) {
                      if (res.authSetting['scope.writePhotosAlbum'] === true) {
                        gotc && gotc();
                      }
                    }
                  })
                }
              },
              fail() {
                wx.showToast({
                  title: '打开设置页失败',
                  icon: 'none',
                })
              }
            })
          }
        })
      } else {
        //已有授权
        gotc && gotc();
      }
    },
    fail() {
      wx.hideLoading();
      wx.showToast({
        title: '获取授权失败',
        icon: 'none',
      })
    }
  })
},
//文件域的输入事件
handleTextInput(e){
  this.setData({
    textVal:e.detail.value
  })
},

//表单提交
handleFormSubmit(){
  const user = wx.getStorageSync('user');
  if(null == user){
    user:{userId:'保密'}
  }
  const that = this;
  const {textVal,chooseImages,title,radio} = this.data;
  if(this.data.radio === 0){
    Toast('请选择一个问题种类！');
        return;
  }
  if(that.data.title == ''){
    Toast('请填写反馈标题！');
        return;
  }
  console.log(that.data.title);
  //合法性提交
  if(!textVal.trim()){
    wx.showToast({
      title: '输入内容为空',
      icon: 'none',
      mask: true,
    });
    return;
  }
  
  //显示等待提示
   wx.showLoading({
     title: "正在提交数据...",
     mask: true,
   });
  console.log("chooseImages.length = " + chooseImages.length);
  //  若不存在图片数据
  if(chooseImages.length !== 0){
    //上传图片
  // 系统提供的API只支持上传单个文件
  //      多个文件需要遍历
    chooseImages.forEach((v,i) => {
      var upTask = wx.uploadFile({
      //文件上传地址
      url: app.url.url + '/feedback/upload',
      // 上传的文件路径
      filePath: v,
      // 上传的文件名称 （参数名称）
      name: "file",
      // 文件以外的其他数据参数
      formData: {},
      success: (result) => {
        let file = JSON.parse(result.data).data;
        if(i === chooseImages.length - 1){
            console.log("开始提交最终请求！\n"+this.UpLoadImgs);
            wx.request({
              url: app.url.url + '/feedback/feedback',
              method:'POST',
              header:{
                "Context-Type": "application/json",
              },
              data:{
                "type":radio,
                "status":0,
                "userId":user.userId,
                "content":textVal,
                "fileId":file.id,
                "title":title,
                "fileUrl":file.fileUrl
              },
              success:res=>{
                console.log(res);
                this.setData({
                  user:res.data.data
                })
              }
            })
            // 清空页面
          this.setData({
            textVal,
            chooseImages:[]
          });
          // 提示框关闭
          wx.hideLoading();
          // 返回上一个页面
          wx.switchTab({
            url:'../me/me'
          })
        }
      }
    });
    })
  }else{
    wx.hideLoading();
    console.log("只提交文本数据！");
    this.setData({
      textVal,
      chooseImage:[]
    });
    wx.navigateBack({
      delta: 1
    });
  }
},

  //选择图片
  handleChooseImage(){
    // wx.openSetting({
    //   success: (result) => {
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       //请求授权
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success() {
    //         }
    //       });
    //     }
    //     console.log(result);
    //   },
    // });
      const that = this;
      if(that.data.chooseImages.length >= 1){
        Toast('目前支持提交一张图片！');
        return;
      }
      console.log(that.data.chooseImages.length);
    wx.chooseImage({
      
      //同时选中图片的数量
      count: 1,
      //图片格式  原图格式    压缩格式
      sizeType: ['original', 'compressed'],
      // 图片来源   相册      照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        that.setData({
          // chooseImages:result.tempFilePaths
          chooseImages:[...that.data.chooseImages,...result.tempFilePaths]
        });
      }
    });
  },

  //点击事件回响
  handleTabsItemChange(e){
    
    const {index} = e.detail;

    let {tabs} = this.data;

    tabs.forEach((v,i) => i === index ? v.isActive = true : v.isActive = false);

    this.setData({
      tabs
    });
  },

  //删除图片
  handleImageDelete(e){
    const {index} = e.currentTarget.dataset;
    let {chooseImages} = this.data;
    chooseImages.splice(index,1);
    this.setData({
      chooseImages
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