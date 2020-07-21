let app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    app.setTitle("登录");
  },
  login: function () {
    app.showLoading('登录中')
    tt.login({
      success: function (res) {
        if (res.code) {
          tt.request({
            url: app.baseUrl+'/college/Index/getToken?code='+res.code,
            success(res) {
              if(res.data.code==200){
                tt.setStorageSync('token', res.data.data)
                app.showToast('登录成功')
                setTimeout(() => {
                  app.hideToast()
                  app.navigateBack()
                }, 1000);
              }
            }
          })
        } else {
          console.log(res.errMsg);
        }
      },
    });
  },
});
