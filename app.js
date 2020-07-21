App({
  // baseUrl: "https://tiaodao.headlinetop.com",
  baseUrl: "http://192.168.111.32:80",
  onLaunch: function () {},
  setTitle: function (title) {
    tt.setNavigationBarTitle({
      title: title,
    });
  },
  showToast: function (title,icon="success") {
    tt.showToast({
      title,
      icon
    })
  },
  hideToast: function () {
    tt.hideToast();
  },
  navigator: function (url) {
    tt.navigateTo({
      url
    })
  },
  navigateBack: function (i=1) {
    tt.navigateBack({
      delta: i
    })
  },
  switchtab: function (url) {
    tt.switchTab({
      url
    })
  },
  showLoading: function (title) {
    tt.showLoading({
      title: title,
    });
  },
  hideLoading: function () {
    tt.hideLoading();
  },
});
