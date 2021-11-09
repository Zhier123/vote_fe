// app.js
App({
  onLaunch() {
    var now = new Date();
    var ddl = new Date("2021-11-09T04:10:00");
    if(now>ddl){
      this.globalData.ischeck = false;
    }
    if(now<ddl){
      wx.setNavigationBarTitle({
        title: '挑战招新问卷',
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    
  },
  globalData: {
    ischeck:true,
    userId:null,
    api:'https://vote.tiaozhan.com/'
    // api:'http://localhost:3000/',
    // api:'http://192.168.43.159:3000/'
  },
  userLogin:function(){
    var that = this;
    
    return new Promise(
      function(resolve,reject){
        wx.login({
          success: res => {
            //  console.log(res);
            //发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.showLoading({
              title: '获取登录态',
              mask:true
            })
            wx.request({
              url: that.globalData.api+'user/login/'+res.code,//res.code,
              success(res){
                if(res.statusCode== 404){
                  wx.hideLoading()
                  wx.showToast({
                    title: '网络错误',
                    icon:'error'
                  })
                  return;
                }
                if(res.data.success==false){
                  console.log(res)
                  wx.hideLoading()
                  wx.showToast({
                    title: '后台错误',
                    icon:'error'
                  })
                  return;
                }
                wx.hideLoading()
                that.globalData.userId = res.data.userId;
                // console.log(res.data)
                // console.log(res);
                wx.removeStorageSync('sessionid');
                wx.setStorageSync("sessionid",res.header["Set-Cookie"])
                //同步登录状态 
                that.globalData.userInfo = res.header["Set-Cookie"];
                // console.log(res.header["Set-Cookie"]);
                resolve(res.data);
              },
              fail(res){
                
                wx.hideLoading()
                wx.showToast({
                  title: '获得登录态失败',
                  icon:'error'
                })
                reject(res.data);
              }
            })
          },
          fail(res){
          
            wx.hideLoading()
            wx.showToast({
                    title: '系统错误',
                    icon:'error'
                  })
            console.log(res)
          }
        })
      }
    )
  }
})
