// components/question/question.js
import{deepClone} from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   qid:Number ||String,
   questionNum:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    questionName:'',
    selectableNum:1,//by default,

    optionList:[{
      innerText:'', 
    },
    {
      innerText:'', 
    },
    {
      innerText:'', 
    },
    {
      innerText:'', 
    },
    {
      innerText:'', 
    },
   ]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //任何修改当前问题信息的methods 都会向createVote(父)组件发送更新请求
    Tofather:function(){
        var formatOptions = [];
        this.data.optionList.map(function(item){
          formatOptions.push(item.innerText);
        })
        var data={
          index:this.data.qid,
          title:this.data.questionName,
          selectionNum:this.data.selectableNum,
          options:formatOptions
        }
        this.triggerEvent('getQuestionInfo',data)
    },

    inputTitleHandler:function(ev){//修改问题标题
      this.setData({
        questionName:this.data.questionName = ev.detail.value
      })
      this.Tofather();
    },
    bindSelectNumChange(ev){//修改可选择个数
      console.log("可选择上限变化为：",ev.detail.value);
  
      this.setData({
        selectableNum:ev.detail.value
      })
      this.Tofather();
    },
    bindAddOption:function(ev){
      let list = deepClone(this.data.optionList);
      list.push({
        innerText:""
      })
      this.setData({
        optionList:list
      })
      this.Tofather()
      console.log(this.data.optionList)
    },
    deleteOption:function(ev){
      console.log("deleteid",ev.detail)
      var vid = ev.detail;

      //深拷贝 改变 再setData
      let list = deepClone(this.data.optionList);
      list.splice(parseInt(vid),1);
      console.log(list)
      this.setData({
        optionList:list
      })
      console.log(this.data.optionList)
      this.Tofather();
    },
    collectInfoHandler:function(ev){
      const vid= ev.detail.vid;
      const innerText = ev.detail.innerText
      var tochange = "optionList["+vid+"].innerText"
      this.setData({
       [tochange]:innerText
      })
      this.Tofather()
    },
    ifEmpty:function(){//对question 的非空校验
      var isEmpty= false;
      if(this.data.questionName == ''){
        wx.showToast({
          title: '标题不能为空',
          icon:'error'
        })
       isEmpty=true;
      }
      if(isEmpty==true){
        return isEmpty;
      }
      this.data.optionList.map(function(item){
        if(item.innerText == ''){
          wx.showToast({
            title: '存在空的选项',
            icon:'error'
          })
          isEmpty =true
        }
      })
      return isEmpty;
    },
    nextQuestion:function(){
      
      //要校验当前数据
      var isEmpty = this.ifEmpty();
      if(isEmpty){
        console.log("当前question有空白未填写 无法跳转");
        return;
      }
      //向父组件抛出请求到下一个问题的请求
      this.triggerEvent('nextQuestion',this.data.qid)
    },
    preQuestion:function(){
      this.triggerEvent('preQuestion',this.data.qid)
    },
    submitHandler:function(){
      //先非空校验当前页面
      if(this.ifEmpty()){
        console.log("当前question有空白未填写 无法提交");
        return;
      }
      this.triggerEvent('submit')
    }
  }
})
