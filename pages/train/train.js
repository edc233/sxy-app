const app = getApp()
Page({
  data: {
    id:0,
    train:{}
  },
  onLoad: function (options) {
    app.setTitle('培训')
    this.setData({
      id:options.id
    });
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
        console.log(this.data.train)
      }
    });
  },
  
})