// app.js
App({
 
  onLaunch() {
    console.log("整理 小程序所有流程 思考 有什么地方还没有写好 什么地方需要优化还没写：--1 显示投票人作为投票建立者查看投票情况时同样会被保护政策挡住--2.生成带参数的二维码 需要appid appsecret 以及 actoken 3.投票查看的下拉刷新还没写  优化：1.美工")
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
  
  },
  globalData: {
    userInfo: null
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
              url: 'http://localhost:3000/user/login/'+'Aliu',//res.code,
              success(res){
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
