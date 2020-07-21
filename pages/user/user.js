const app = getApp();
Page({
  data: {
    isLog: true,
    username: "",
    department: "",
    avatar: "",
    position: "",
  },
  onLoad: function (options) {
    app.setTitle(" ");
  },
  onShow: function () {
    const that = this;
    if (this.data.username) {
      return
    } else if (!this.data.username && tt.getStorageSync("token")) {
      tt.request({
        url: app.baseUrl + "/college/User/getUserInfo",
        data: {
          token: tt.getStorageSync("token"),
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              username: res.data.data.name,
              department: res.data.data.depart_name,
              avatar: res.data.data.avatar,
              position: res.data.data.position_name,
            });
          }
        },
      });
    } else {
      this.setData({
        isLog: false,
      });
    }
  },
  handleLogin: function () {
    app.navigator("/pages/login/login");
  },
});
