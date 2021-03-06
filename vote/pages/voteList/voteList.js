const { deepClone } = require("../../utils/util");

// pages/voteList/voteList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischeck:true,
    current:1,
    swiperHeight:1208,
    userPublished:{
      data:[
      {id:-1,name:'网络错误'},
      {id:-1,name:'网络错误'},
      {id:-1,name:'网络错误'},
    ],
    page:1,
    limit:10000,
  },
    userVoted:{
      data:[],
      page:1,
      limit:10000
    }
  },
  getQRCODE:function(ev){
    console.log(ev);
  },
  bindtapItemHandler(ev){
    var voteId = ev.currentTarget.dataset.id;
    console.log("vid",voteId);
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'确认',
      content:'查看此问卷吗?',
      success(res){
        console.log('interface suc');
        if(res.confirm){
          console.log('confirm');
          wx.navigateTo({
            url: '../result/result?voteId='+voteId,
          })
        }
      }
    })
  },
  deleteHandler:function(ev){
    console.log(ev);
    var that = this;
    let voteId = ev.currentTarget.dataset.id;
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'删除',
      content:'确定删除此问卷?',
      success(res){
        if(res.confirm){
          wx.showLoading({
            mask:true,
            title: '删除ing...',
          })
          wx.request({
            url: app.globalData.api+'vote/'+voteId,
            method:'DELETE',
            header:{
              'cookie':wx.getStorageSync('sessionid')
            },
            success(res){
              if(res.data.success == true){
              
                var list = deepClone(that.data.userPublished.data)
                list.splice(ev.currentTarget.dataset.vid,1);
                console.log(list);
                that.setData({
                  "userPublished.data":list
                })
                wx.hideLoading();
              }
            },fail(res){
              console.log(res);
              wx.showToast({
                title: '请求后台失败',
                icon:'error'
              })
            }
          })
        }
      }
    })
  },
  swiperChangeHandler:function(ev){
    console.log(ev)
    this.setData({
      current:ev.detail.current
    })
  },
  currTo0:function(){
    
    this.setData({
      current:0,
      swiperHeight :this.data.userPublished.data.length*130
    })

  },
  currTo1:function(){
    this.setData({
      current:1,
      swiperHeight:this.data.userVoted.data.length*130
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowT = new Date();
    var ddlT = new Date("2021-11-09T04:10:00");
    if(nowT>ddlT){
      this.setData({
        ischeck:false
    })
    
    }
    if(nowT<ddlT){
      return;
    }

    wx.showLoading({
      title: '加载中',
      mask:true
    })
    //异步获取两个列表
    var that = this;
    wx.request({
      url: app.globalData.api+'user/published?page='+that.data.userPublished.page+"&limit="+that.data.userPublished.limit,
      method:'GET',
      header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        if(res.data.success == false){
          wx.hideLoading()
          wx.showToast({
            title: '系统错误',
            icon:'error'
          })
          console.log("登入至后台失败");
          return;
        }else{
          console.log("usr Published:",res)
          that.setData({
           "userPublished.data":res.data.data,
            swiperHeight:res.data.data.length * 130
          })
          wx.hideLoading({
            success: (res) => {
              console.log("关闭loading",res);
            },
          })
        }
      },
      fail(res){
        wx.hideLoading()
        wx.showToast({
          title: '请求后台失败',
          icon:'error'
        })
        console.log("接口调用失败:",res)
      }
      //需要同步数据，同时计算swiperheight高度
    })
    wx.request({
      url: app.globalData.api+'user/voted?page='+that.data.userVoted.page+"&limit="+that.data.userVoted.limit,
      header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        if(res.statusCode== 404){
          wx.hideLoading()
          wx.showToast({
            title: '网络错误',
            icon:'error'
          })
          return;
        }
        if(res.data.success == false){
          wx.showToast({
            title: '后台错误',
            icon:'error'
          })
          wx.hideLoading()
          console.log("请求失败")
          return;
        }else{
          console.log("userVote",res);
          that.setData({
            "userVoted.data":res.data.data
          })
        }
      },fail(res){
        wx.showToast({
          title: '请求后台失败',
          icon:'error'
        })
        console.log(res)
      }
    })
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