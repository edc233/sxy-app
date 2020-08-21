App({
  //baseUrl: "https://tiaodao.headlinetop.com",
  baseUrl: "http://192.168.111.32:80",
  onLaunch: function () {},
  setTitle: function (title) {
    tt.setNavigationBarTitle({
      title: title,
    });
  },
  showToast: function (title, icon = "success") {
    tt.showToast({
      title,
      icon,
    });
  },
  hideToast: function () {
    tt.hideToast();
  },
  navigator: function (url) {
    tt.navigateTo({
      url,
    });
  },
  navigateBack: function (i) {
    tt.navigateBack({
      delta: i,
    });
  },
  switchtab: function (url) {
    tt.switchTab({
      url,
    });
  },
  showLoading: function (title) {
    tt.showLoading({
      title: title,
    });
  },
  hideLoading: function () {
    tt.hideLoading();
  },
  getNum() {
    this.getCollegeNumber();
    this.getExamNumber();
  },
  getCollegeNumber() {
    tt.request({
      url: this.baseUrl + "/college/College/getCollegeNumber", // 目标服务器url
      data: {
        token: tt.getStorageSync("token"),
      },
      method: "GET",
      success: (res) => {
        if (res.data.data) {
          tt.setTabBarBadge({
            index: 0,
            text: ""+res.data.data+""
            })
        }else{
          tt.removeTabBarBadge({
            index:0,
          });
        }
      }
    });
  },
  getExamNumber() {
    tt.request({
      url: this.baseUrl + "/college/Exam/getExamNumber", // 目标服务器url
      data: {
        token: tt.getStorageSync("token"),
      },
      method: "GET",
      success: (res) => {
        if (res.data.data) {
          tt.setTabBarBadge({
            index: 1,
            text: ""+res.data.data+""
            })
        }else{
          tt.removeTabBarBadge({
            index:1,
          });
        }
      }
    });
  },
});
