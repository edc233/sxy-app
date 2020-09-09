const app = getApp();
Page({
  data: {
    trianNumber: 0,
    examNumber: 0,
  },
  onLoad: function (options) {
    const that = this;
    if (!tt.getStorageSync("token")) {
      tt.showModal({
        title: "提示",
        content: "暂未登录，请先授权登录",
        success: function (res) {
          if (res.confirm) {
            that.login();
          }
        },
      });
    }
  },
  onShow() {
    if (tt.getStorageSync("token")) {
      this.getCollegeNumber();
      this.getExamNumber();
    }
  },
  login: function () {
    tt.login({
      success: function (res) {
        if (res.code) {
          // return
          app.showLoading("登录中");
          tt.request({
            url: app.baseUrl + "/college/Index/getToken?code=" + res.code,
            success(re) {
              app.hideToast();
              if (re.data.code == 200) {
                tt.setStorageSync("token", re.data.data);
                app.showToast("登录成功");
              } else {
                tt.showModal({
                  title: "提示",
                  content: re.data.msg,
                  showCancel: false,
                });
              }
            },
          });
        } else {
          console.log(res.errMsg);
        }
      },
      fail: function (err) {
        console.log(err);
      },
    });
  },
  getCollegeNumber() {
    const that = this;
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeNumber", // 目标服务器url
      data: {
        token: tt.getStorageSync("token"),
      },
      method: "GET",
      success: (res) => {
        if (res.data.code == 200) {
          that.setData({
            trianNumber: res.data.data,
          });
        }
      },
    });
  },
  getExamNumber() {
    const that = this;
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamNumber", // 目标服务器url
      data: {
        token: tt.getStorageSync("token"),
      },
      method: "GET",
      success: (res) => {
        if (res.data.code == 200) {
          that.setData({
            examNumber: res.data.data,
          });
        }
      },
    });
  },
  handleIn(e) {
    const i = e.currentTarget.dataset.type;
    if (!tt.getStorageSync("token")) {
      tt.showModal({
        title: "提示",
        content: "暂未登录，请先授权登录",
        success: function (res) {
          if (res.confirm) {
            that.login();
          }
        },
      });
    } else {
      if (i == 1) {
        app.navigator("/pages/pc/train/train");
      } else if (i == 2) {
        app.navigator("/pages/pc/exam/exam");
      } else if (i == 3) {
        app.navigator("/pages/pc/course/course");
      } else {
        app.navigator("/pages/pc/user/user");
      }
    }
  },
});
