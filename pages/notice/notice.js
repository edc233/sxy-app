const app = getApp()
Page({
  data: {
    id:0,
    exam:{}
  },
  onLoad: function (options) {
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
    }
    this.setData({
      id:options.exam_id
    });
    this.getDetail()
  },
  onShow(){
    app.setTitle('考试通知')
  },

  getDetail(){
    tt.request({
      url: app.baseUrl+'/college/Exam/getExamPlianInfo', // 目标服务器url
      data:{
        token: tt.getStorageSync("token"),
        id:this.data.id
      },
      success: (res) => {
        this.setData({
          exam:res.data.data
        });
        console.log(res)
      }
    });
  },
  naviTo(){
    tt.redirectTo({
      url: '../examDetail/examDetail', // 指定页面的url
      data:this.data.id,
      fail(res){
        console.log(res)
      }
    });
  }
})