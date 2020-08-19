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
          console.log(res.code)
          // return
          tt.request({
            url: app.baseUrl+'/college/Index/getToken?code='+res.code,
            success(re) {
              if(re.data.code==200){
                tt.setStorageSync('token', re.data.data)
                app.showToast('登录成功')
                let pages = getCurrentPages()
                console.log(pages[pages.length-2])
                let prePage=pages[pages.length-2]
                if(prePage.__route__=='pages/index/index'||prePage.__route__=='pages/exam/exam'){
                  prePage.setData({
                    isBackFromLogin:true
                  })
                }
                setTimeout(() => {
                  app.hideToast()
                  tt.navigateBack({
                    delta: 1
                  })
                }, 500);
              }else{
                tt.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel:false
                })
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
