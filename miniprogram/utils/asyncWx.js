/**
 * promise 形式的 getSetting
 * @returns 
 */
export const getSetting=()=>{
  return new Promise((resolve,reject)=>{
      wx.getSetting({
      success: (result) => {
          resolve(result);
      },
      fail: (err) => {
          reject(err);
      }
      });
  })
}
/**
* promise 形式的 chooseAddress
* @returns 
*/
export const chooseAddress=()=>{
  return new Promise((resolve,reject)=>{
      wx.chooseAddress({
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {reject(err)}
      });
  })
}

/**
* promise 形式的 openSetting
* @returns 
*/
export const openSetting=()=>{
  return new Promise((resolve,reject)=>{
      wx.openSetting({
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {reject(err)}
      });
  })
}

/**
* 
* @param {*} param0 
* @returns 
*/
export const showModal=({content})=>{
  return new Promise((resolve,reject)=>{
      wx.showModal({
          title: '注意',
          content: content,
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (res) => {
              resolve(res);
          },
          fail:(err) => {
              reject(err)
          }
        });
  })
}


/**
* 
* @param {*} param0 
* @returns 
*/
export const showToast=({title})=>{
  return new Promise((resolve,reject)=>{
      wx.showToast({
          title: title,
          icon: 'none',
          duration: 2000,
          mask: false,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
      });
        
  })
}

/**
* 
* @returns 
*/
export const login=()=>{
  return new Promise((resolve,reject)=>{
      wx.login({
          timeout:10000,
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {reject(err)}
      });
        
        
  })
}

/**
* 调用微信系统支付接口
* @param {object} pay  支付必要的参数
*   nonceStr: "oo5V3Cw1EaB6XXWm"
*   package: "prepay_id=wx172256438021233182c3c9ab95f8cc0000"
*   paySign: "51599D616C85B687A7C72D09FD92B369"
*   signType: "MD5"
*   timeStamp: "1637161004"
* @returns 
*/
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject)=>{
      wx.requestPayment({
          ...pay,
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {
              reject(err);
          },
      });
  })
}