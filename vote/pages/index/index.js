// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    fake:{
      name:'',
      id:'',
      xq:'',
      yxbm:''
    },
    canshow:false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  joinTenzor(){
    const da = this.data.fake
    if(da.name==''||da.id==''||da.xq==''||da.yxbm==''){
      wx.showToast({
        title: '有空未填写哦',
        icon:'error',
        mask:true,

      })
     
    }
    wx.showToast({
      title: '申请已提交',
      icon:'success',
      mask:true,
      duration:2000
    })
    wx.navigateTo({
      url: '../createVote/createVote',
    })
  },
  bindscanCode(){
    wx.showLoading({
      title: 'loading',
    }),
    wx.scanCode({
      onlyFromCamera: false,
      success (res) {
        wx.hideLoading()
        wx.navigateTo({
          url:'..'+ res.path.slice(31),
          success(res){
            console.log(res);
          },fail(res){
            wx.showToast({
              title: '无效/过期二维码',
            })
            console.log(res);
          }
        })
        console.log(res)
      },fail(res){
        wx.hideLoading()
        wx.showToast({
          title: '调度接口失败',
        })
      }
    })
  },
  bindViewTap() {
    this.getUserProfile()
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  toCreate(){
    wx.navigateTo({
      url:'../createVote/createVote'
    })
  },
  toList:function(){
    wx.navigateTo({
      url:'../voteList/voteList'
    })
  },  
  bfname(ev){
  console.log(ev)
    this.setData({
      "fake.name":ev.detail.value
    })
  },
  bfid(ev){
    this.setData({
      "fake.id":ev.detail.value
    })
  },
  bfxq(ev){
    this.setData({
      "fake.xq":ev.detail.value
    })
  },
  bfyxbm(ev){
    this.setData({
      "fake.yxbm":ev.detail.value
    })
  },
  onLoad() {  
   if(app.globalData.ischeck==false){
      this.setData({
        canshow:true
      })
      return;
    }
    var now = new Date();
    var ddl = new Date("2021-11-09T04:10:00");
    if(now<ddl){
      return;
    }else{
      this.setData({
        canshow:true
      })
    }
    if(app.globalData.userId == null){
      app.userLogin()
      }    
      // console.log(app)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }else
    {
      console.log("can'tgetUserProfile");
    }
  },
  getUserProfile(e) {
    
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   // console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
