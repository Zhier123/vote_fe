// pages/voteList/voteList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    swiperHeight:1208,
    userPublished:{
      data:[
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
      {id:1,name:'投票名称'},
    ],
    page:1,
    limit:9,
  },
    userVoted:{
      data:[],
      page:1,
      limit:9
    }
  },
  bindtapItemHandler(ev){
    var voteId = ev.currentTarget.dataset.id;
    console.log("vid",voteId);
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'确认',
      content:'查看此投票吗?',
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
    wx.showLoading({
      title: '加载中',
    })
    //异步获取两个列表
    var that = this;
    wx.request({
      url: 'http://localhost:3000/user/published?page='+that.data.userPublished.page+"&limit="+that.data.userPublished.limit,
      method:'GET',
      header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        if(res.data.success == false){
          console.log("请求失败")
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
        console.log("接口调用失败:",res)
      }
      //需要同步数据，同时计算swiperheight高度
    })
    wx.request({
      url: 'http://localhost:3000/user/voted?page='+that.data.userVoted.page+"&limit="+that.data.userVoted.limit,
      header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        console.log("调用接口成功")
        if(res.data.success == false){
          console.log("请求失败")
        }else{
          console.log("userVote",res);
          that.setData({
            "userVoted.data":res.data.data
          })
        }
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