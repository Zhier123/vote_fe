// components/option/option.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vid:String||Number,
    innerText:String,
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deleteOption:function(ev){
      var vid = this.data.vid
      // detail对象，提供给事件监听函数
      this.triggerEvent('delOption', vid)
    },
    bindInputHandler:function(ev){
      var data={
        vid:this.data.vid,
        innerText:ev.detail.value,
      }
      this.triggerEvent('collectInfo',data);
    }
  }
})
