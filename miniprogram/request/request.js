const app = getApp();

//同时发送异步代码的次数
let ajaxTimes=0;

export const request=(params)=>{
    let header={...params.header};
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync("token");
    }
    ajaxTimes++;
    // 加载提示
    wx.showLoading({
        title: "加载中",
        mask: true,
      });
    // 定于域名路径
    // const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    // const baseUrl="http://localhost:80/wx";
    const baseUrl = app.url.url;
    // const baseUrl="http://jandmla.top:8828";
    return new Promise((reslove,reject)=>{
        var reqTask = wx.request({
            ...params,
            header:header,
            url: baseUrl+params.url,
            success:(result)=>{
                // reslove(result.data);
                reslove(result.data.data);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes -- ;
                if(ajaxTimes === 0)
                    wx.hideLoading();
            }
        });
          
    });
    
      
}