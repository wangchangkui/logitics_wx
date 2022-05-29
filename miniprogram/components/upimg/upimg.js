// components/upimg/upimg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upimg:{
      type:String,
      value:""
    }

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
    handleDeleteImage(e){
      console.log(e);
      const {index} = e.currentTarget.dataset;
      console.log(index);
      this.triggerEvent("upimgDeleteImage",{index});
    }

  }
})
