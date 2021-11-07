// app.js
App({
  
  onLaunch() {
    console.log("整理 小程序所有流程 思考 有什么地方还没有写好 什么地方需要优化还没写：---2.生成带参数的二维码 需要appid appsecret 以及 actoken 3.投票查看的下拉刷新还没写（解决方案1.不要下拉刷新直接把limit=10000,pgae =1 解决方案二:写一个到底刷新）  优化：1.美工")
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
  
  },
  globalData: {
    userId:null,
    api:'http://192.168.31.56:3000/'
  },
  userLogin:function(){
    var that = this;
    return new Promise(
      function(resolve,reject){
        wx.login({
          success: res => {
             console.log(res);
            //发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: that.globalData.api+'user/login/'+res.code,//res.code,
              success(res){
                if(res.data.success == false){
                  wx.showToast({
                    title: '系统错误',
                    icon:'error'
                  })
                  console.log("登入至后台失败");
                }
                that.globalData.userId = res.data.userId;
                console.log(res.data)
                console.log(res);
                wx.removeStorageSync('sessionid');
                wx.setStorageSync("sessionid",res.header["Set-Cookie"])
                //同步登录状态 
                that.globalData.userInfo = res.header["Set-Cookie"];
                // console.log(res.header["Set-Cookie"]);
                resolve(res.data);
              },
              fail(res){
                reject(res.data);
              }
            })
          },
          fail(res){
            console.log(res)
          }
        })
      }
    )
  }
})
