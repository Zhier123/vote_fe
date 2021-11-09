// pages/result/result.js
const app = getApp()
const{formatTime_date,formatTime_time} = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischeck:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindOptionTapHandler:function(ev){
    if(this.data.votersVisibility == 'private'){
      console.log("匿名不予显示");
      return;
    }else{
      var oid = ev.currentTarget.dataset.option;
      var qid =ev.currentTarget.dataset.qid;
      if(this.data.questions[qid].options[oid].count == 0){
        return;
      }else{
        wx.navigateTo({
          url: '../voters/voters?qid='+qid+"&oid="+oid+"&voteId="+this.data.voteId,
          ///需要一个利用qid oid voitID请求的接口 获取所有头像昵称 
        })
      }
    }
   
    
  },
  continue(){
    wx.navigateTo({
      url: '../voteList/voteList',
    })
  },
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



    var that= this;
    console.log(options);
    that.setData({
      voteId:options.voteId
    })
    wx.request({
      url: app.globalData.api+'vote/'+options.voteId,
      method:'GET',
      header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        if(res.data.success==false){
          wx.showToast({
            title: '后台错误',
            icon:'error'
          })
          return;
        }
        var now =new Date();
          var ddl =new Date(res.data.data.dueDate);
          var isCreator = (app.globalData.userId == res.data.data.creatorUUID)
        if(res.data.data.voted == false && (res.data.data.creatorUUID != app.globalData.userId &&(now<ddl))){
          console.log("还未填写问卷 还未截至 不可查看结果");
          wx.navigateTo({
            url: '../checkVote/checkVote?voteId='+that.data.voteId,
          })
        }
        console.log(res);
        if(res.data.success == true){
          console.log(isCreator);
          var overTime =false;
          if(now>ddl){
            overTime =true// 判定问卷是否过期
          }
          that.setData(res.data.data)
          that.setData({
            isCreator:isCreator,
            dueDate:formatTime_date(ddl)+" "+formatTime_time(ddl),
          });
          //生成一个计算每一个问题一共多少票的计算属性
          
          res.data.data.questions.map(function(item,index){
            let sum =0;
            item.options.map(function(op){
              sum += (op.count||0);
            })
            let tochange = "questions["+index+"].ticketNum"
            that.setData({
              [tochange]:sum
            })
          })

          console.log("data",that.data);
        }else{
          console.log("opps",res);
          wx.showToast({
            title: '系统出错',
          })
        }
      },fail(res){
        console.log(res);
        wx.showToast({
          title: '请求后台失败',
          icon:'error'
        })
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