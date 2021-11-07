const {formatTime_date, formatTime_time } = require("../../utils/util");
const app = getApp();
// pages/checkVote/checkVote.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow:false
  },
  checkBoxChange(ev){
    console.log(ev);
    //获取问题id 对回传数据进行校验 修改问题状态 
    var qid =ev.currentTarget.dataset.index;
    var checkedNum= ev.detail.value.length;
    if(checkedNum>this.data.questions[qid].selectionNum){
      wx.showToast({
        title: '超过选择上限',
        icon:'error'
      })
      console.log("超过选择数量上限")
      this.setData({
        checkBox:this.data.checkBox
      })
      return;
    }else{
      const items = this.data.checkBox[qid].options;
      const values = ev.detail.value
      console.log("type of values's member",typeof(values[0]))
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (i == values[j]) {
            items[i].checked = true
            break
          }
        }
      }
      var Tochange = "checkBox["+qid+"].options";
      this.setData({
        [Tochange]:items
      })
    }
  },
  submit:function(ev){
    //非空校验
    var that = this;
    var hasempty = false;
    this.data.checkBox.map(function(item){
      var noTrue = true;
      item.options.map(function(option){
        if(option.checked == true){
          noTrue = false;
        }
      })
      if(noTrue == true){
        hasempty = true;
      }
    })
    if(hasempty == true){
      wx.showToast({
        title: '存在问题未作答',
        icon:'error'
      })
      return;
    }else{
      //确认提交
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'确认',
        content:'确认提交吗',
        success(res){
          if(res.confirm){
            var selected=[];
            console.log(that.data.checkBox)
            that.data.checkBox.map(function(item){
              var answerSheet = []
              item.options.map(function(item,index){
                if(item.checked == true){
                  answerSheet.push(index)
                }
              })
              selected.push(answerSheet);
            })
            console.log(selected)
            wx.request({
              url: app.globalData.api+"vote",
              method:'PUT',
              header:{
                'cookie':wx.getStorageSync('sessionid')
              },
              data:{
                voteId:parseInt(that.data.voteId),
                selected:selected
              },
              success(res){
                console.log(res)
                
                if(res.data.success == true){
                  wx.showToast({
                    title:"提交成功",
                  })
                  wx.navigateTo({
                    url: '../result/result?voteId='+that.data.voteId,
                  })
                }
              },
              fail(res){
                console.log("fail",res);
              }
            })
          }
          else if(res.cancel){

          }
        }
      })
      
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * Page({  onLoad: function(options) {
    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(options.scene)
    //
    var query = options.query.dentistId // 3736
  }
})
   */
  loginFun:function(options){
    var that =this;
    console.log(options)
     var voteId = options.voteId;//通过扫码  进入该页面  获得voteid
     this.setData({
       voteId:voteId
     })
     wx.request({
       url: app.globalData.api+'vote/'+voteId,
       header:{
        'cookie':wx.getStorageSync('sessionid')
      },
      success(res){
        console.log(app.globalData.userInfo);
        that.setData(res.data.data);
        //根据res判断是显示结果还是继续投票
        var now= new Date();
        var ddl = new Date(res.data.data.dueDate);
        if(now>ddl){//已经截止 跳转到结果页面
          
          wx.navigateTo({
            url: '../result/result?voteId='+that.data.voteId,
          })
        }else{
          if(res.data.data.voted==true){
            console.log("已投跳转");
            wx.navigateTo({
              url: '../result/result?voteId='+that.data.voteId,
            })
          }else{//保存数据开始投票
            //这个是给checkBox用的
            var checkBox = res.data.data.questions;
            checkBox.map(function(item){
              item.options.map(function(op){
                op["checked"]=false;
              })
            })
            that.setData({
              canShow:true,        
              dueDate:formatTime_date(ddl)+" "+formatTime_time(ddl),
              checkBox:checkBox
            });
            console.log("data",that.data)
          }
        }
      },
      fail(res){
        console.log(res);
      }
     })
  },
  onLoad: function (options) {
    if(app.globalData.userInfo == null){
      app.userLogin().then(
        ()=>{this.loginFun(options)}//这里写个promise 解决一部问题
      )
    }else{
      this.loginFun(options)
    }
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