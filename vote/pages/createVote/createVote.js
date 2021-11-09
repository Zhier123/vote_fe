const { formatTime_date, formatTime_time } = require("../../utils/util");
const app = getApp();
// pages/createVote/createVote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fake:{
      learned:'',
      learning:'',
      sec:'',
      reason:''
    },
    ischeck:true,
    imgUrl:'',
    modalHidden:true,
    voteTitle:'',
    ifTimeSet:false,
    votersVisibility:'private',
    resultVisibility:'afterVote',
    ddlday:formatTime_date(new Date()),
    ddltime:formatTime_time(new Date()),
    dueDate:(new Date()).toJSON(),
    swiperPage:0,
    swiperHeight:1220,
    questionList:[
      {
      },
    ]
  },
  modalCancel:function(){
    this.setData({
      modalHidden:true
    })
    if(this.data.voteId){
      wx.navigateTo({
        url: '../result/result?voteId='+this.data.voteId,
      })
    }
  },
  modalConfirm(){
    this.setData({
      modalHidden:true
    })
    if(this.data.voteId){
      wx.navigateTo({
        url: '../result/result?voteId='+this.data.voteId,
      })
    }
  },
  dueDateHandler:function(){//微信小程序的时间和日期是分离的 我得自己写个用来生成日期的son
    var ddl = new Date(this.data.ddlday+"T"+this.data.ddltime+":00");
    // console.log(this.data.ddlday+"T"+this.data.ddltime+":00"+"dueDate",ddl);
    this.setData({
      dueDate:ddl.toJSON()
    })
  },
  bindTitleChange: function(ev){
    // console.log("title发生改变 携带值为:",ev.detail.value);
    this.setData({
      voteTitle:ev.detail.value
    })

  },
    bindPickerChange_day: function(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        ddlday: e.detail.value,
        ifTimeSet:true,
      })
      this.dueDateHandler()
  },
    bindPickerChange_time:function(e){
      this.setData({
        ddltime:e.detail.value,
        ifTimeSet:true,
      })
      // console.log(e.detail.value)
      this.dueDateHandler();
    },

    anonymousHandler:function(ev){
        this.setData({
          votersVisibility:ev.detail.value?'public':'private'
        })
        //  console.log(this.data.votersVisibility);
    },
    resultHandler_outer(ev){
      this.setData({
        resultVisibility:ev.detail.value?'afterVote':'private',
      })
      //  console.log(this.data.resultVisibility)
    },
   
      // console.log(this.data.resultVisibility)

  createVoteHandler:function(){
    //非空校验
    
    if(this.data.voteTitle==''){
      wx.showToast({
        title: '问卷标题不为空',
        icon:'error'
      })
      return;
    }
    var now = new Date();
    var ddl = new Date(this.data.ddlday+"T"+this.data.ddltime+":00");
    if(this.data.ifTimeSet==false){
      wx.showToast({
        title: '截止日期未设定',
        icon:'error'
      })
      return ;
    }else if(now>ddl){
      wx.showToast({
        title: '截止日期不合理',
        icon:'error'
      })
      return ;
    }
   
    this.setData({
      swiperPage:1
    })
    wx.setNavigationBarTitle({
      title: this.data.swiperPage+'/'+this.data.questionList.length,
    })
  },
  stopTouchMove:function(){
    //用来禁止手滑
    return false
  },
  questionInfoHandler:function(ev){
   
    // console.log(ev.detail)
    var tochange = "questionList["+ev.detail.index+"]"
    this.setData({
      swiperHeight:1220+ev.detail.options.length*70,
      [tochange]:{
        title:ev.detail.title,
        selectionNum:ev.detail.selectionNum,
        options:ev.detail.options
      }
    })
    // console.log(this.data.questionList)
  },
  preQuestionHandler:function(ev){
    // console.log(ev);
    if(ev.detail==0){
      return;
    }else{
      this.setData({
        swiperPage: this.data.swiperPage-1,
        swiperHeight:1220+this.data.questionList[ev.detail-1].options.length*70,
      })
      wx.setNavigationBarTitle({
        title: this.data.swiperPage+'/'+this.data.questionList.length,
      })
    }
  },
  nextQuestionHandler:function(ev){
    if(this.data.swiperPage==this.data.questionList.length){
      this.setData({
        swiperHeight:1220
      })
      var list = this.data.questionList;
      list.push({})
      this.setData({
        questionList:list
      })
      this.setData({
        swiperPage:this.data.swiperPage+1
      })
      wx.setNavigationBarTitle({
        title: this.data.swiperPage+'/'+this.data.questionList.length,
      })
    }else{
      this.setData({
        swiperPage: this.data.swiperPage+1,
        swiperHeight:1220+this.data.questionList[ev.detail].options.length*70,
      })
      wx.setNavigationBarTitle({
        title: this.data.swiperPage+'/'+this.data.questionList.length,
      })
    }
    
    // console.log(this.data.questionList)
  },
  submitHandler:function(){
    //对话框确认
    var that  = this;
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"确认提交",
      content:'确认提交该问卷吗',
      success(res){
        if(res.confirm){
          // console.log("用户提交");
          var parma  ={
            name:that.data.voteTitle,
            dueDate:that.data.dueDate,
            votersVisibility:that.data.votersVisibility,
            resultVisibility:that.data.resultVisibility,
            questions:that.data.questionList,
          }
          // console.log("parma",parma);
          //开始提交  //利用后端接口提交
          wx.request({
            url: app.globalData.api+'vote',
            method:'POST',
            data:parma,
            header:{
              'cookie':wx.getStorageSync('sessionid')
            },
            success(res){
              if(res.statusCode ==404){
                wx.hideLoading()
                wx.showToast({
                  title: '网路错误',
                  icon:'error'
                })
                return;
              }
              if(res.data.success==false){
                wx.showToast({
                  title: '后台错误',
                  icon:'error'
                })
                return;
              }
              // console.log(res);
              that.setData({
                voteId:res.data.voteId
              })
              wx.showLoading({
                title: '生成二维码ing..',
                mask:true
              })
              var voteId = res.data.voteId;
              //生成二维码 并且携带voteID
              var api = app.globalData.api
              wx.cloud.callFunction({
                name:'getQRCODE',
                data:{
                  path:api+'pages/checkVote/checkVote?voteId='+voteId,
                  uploadPath:'qrcode/'+voteId+'.png'
                },success(res){
                  // console.log(res);//打印云函数结果
                  let bufferImg = "data:image/png;base64," + wx.arrayBufferToBase64(res.result.buffer);
                  that.setData({
                      imgUrl: bufferImg,
                      modalHidden:false,
                  });
                  wx.hideLoading()
                },fail(res){
                  wx.showToast({
                    title: '请求云函数失败',
                    icon:'error'
                  })
                  wx.hideLoading()
                  console.log("调用云函数失败",res)
                }
              })
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
          // console.log("用户取消");
        }
      },fail(res){
        wx.showToast({
          title: 'modal调用失败',
          icon:'error'
        })
        console.log("modal调用失败")
      }
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




    wx.cloud.init();
    if(app.globalData.userInfo == null){
      app.userLogin()
    }
  },
  continue(){
    wx.navigateTo({
      url: '../checkVote/checkVote',
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