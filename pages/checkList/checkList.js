const app = getApp();
Page({
  data: {
      id:0,
      tableData:[]
  },
  onPullDownRefresh() {
      this.getNotSigninStaff()
  },
  onLoad: function (options) {
    tt.showLoading({ title: "加载中" });
    console.log(options)
    this.setData({
      id : options.id
    });
    this.getNotSigninStaff();
  },
  getNotSigninStaff:function(e){
    tt.request({
      url: app.baseUrl+'/college/Lecturer/getNotSigninStaff', // 目标服务器url
      data:{
        id : this.data.id,
        token: tt.getStorageSync("token"),
      },
      success: (res) => {
        tt.stopPullDownRefresh();
        tt.hideLoading();
        console.log(res)
        this.setData({
          tableData:res.data.data
        })
      }
    });
  }
})