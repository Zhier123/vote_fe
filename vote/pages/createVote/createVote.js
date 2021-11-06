const { formatTime_date, formatTime_time } = require("../../utils/util");

// pages/createVote/createVote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteTitle:'',
    votersVisibility:'public',
    resultVisibility:'private',
    ddlday:formatTime_date(new Date()),
    ddltime:formatTime_time(new Date()),
    dueDate:(new Date()).toJSON(),
    swiperPage:0,
    questionList:[
      {
      },
    ]
  },
  dueDateHandler:function(){//微信小程序的时间和日期是分离的 我得自己写个用来生成日期的son
    var ddl = new Date(this.data.ddlday+"T"+this.data.ddltime+":00");
    // console.log(this.data.ddlday+"T"+this.data.ddltime+":00"+"dueDate",ddl);
    this.setData({
      dueDate:ddl.toJSON()
    })
  },
  bindTitleChange: function(ev){
    console.log("title发生改变 携带值为:",ev.detail.value);
    this.setData({
      voteTitle:ev.detail.value
    })

  },
    bindPickerChange_day: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ddlday: e.detail.value
      })
      this.dueDateHandler()
  },
    bindPickerChange_time:function(e){
      this.setData({
        ddltime:e.detail.value
      })
      console.log(e.detail.value)
      this.dueDateHandler();
    },

    anonymousHandler:function(ev){
        this.setData({
          votersVisibility:ev.detail.value?'private':'public'
        })
         console.log(this.data.votersVisibility);
    },
    resultHandler_outer(ev){
      this.setData({
        resultVisibility:ev.detail.value?'afterVote':'private',
      })
       console.log(this.data.resultVisibility)
    },
   
      // console.log(this.data.resultVisibility)

  createVoteHandler:function(){
    //非空校验
    if(this.data.voteTitle==''){
      wx.showToast({
        title: '投票标题不为空',
        icon:'error'
      })
      return;
    }
    this.setData({
      swiperPage:1
    })
  },
  stopTouchMove:function(){
    //用来禁止手滑
    return false
  },
  questionInfoHandler:function(ev){
    console.log(ev.detail)
    var tochange = "questionList["+ev.detail.index+"]"
    this.setData({
      [tochange]:{
        title:ev.detail.title,
        selectionNum:ev.detail.selectionNum,
        options:ev.detail.options
      }
    })
    console.log(this.data.questionList)
  },
  nextQuestionHandler:function(){
    var list = this.data.questionList;
    list.push({})
    this.setData({
      questionList:list
    })
    this.setData({
      swiperPage:this.data.swiperPage+=1
    })
    console.log(this.data.questionList)
  },
  submitHandler:function(){
    //对话框确认
    var that  = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"确认提交",
      content:'确认提交该投票吗',
      success(res){
        if(res.confirm){
          console.log("用户提交");
          var parma  ={
            name:that.data.voteTitle,
            dueDate:that.data.dueDate,
            votersVisibility:that.data.votersVisibility,
            resultVisibility:that.data.resultVisibility,
            questions:that.data.questionList,
          }
          console.log("parma",parma);
          //开始提交  //利用后端接口提交
          wx.request({
            url: 'http://localhost:3000/vote',
            method:'POST',
            data:parma,
            header:{
              'cookie':wx.getStorageSync('sessionid')
            },
            success(res){
              wx.showToast({
                title: '提交成功!',
                icon:'success'
              })
              //生成二维码 并且携带voteID
            },
            fail(res){
              wx.showToast({
                title: '提交失败-_-',
                icon:'error'
              })
              console.log(res);
            }
          })
        }else if(res.cancel){
          console.log("用户取消");
        }
      }
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