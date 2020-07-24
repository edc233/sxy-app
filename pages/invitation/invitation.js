const app = getApp()
Page({
  data: {
    id:0,
    train:{}
  },
  onLoad: function (options) {
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
    }
    this.setData({
      id:options.college_id
    });
    this.getDetail()
  },
  onShow(){
    app.setTitle('培训')
  },

  getDetail(){
    tt.request({
      url: app.baseUrl+'/college/College/getCollegeInfo', // 目标服务器url
      data:{
        token: tt.getStorageSync("token"),
        id:this.data.id
      },
      success: (res) => {
        this.setData({
          train:res.data.data
        });
        console.log(res)
      }
    });
  },
  naviTo(){
    app.switchtab("../index/index")
  }
})