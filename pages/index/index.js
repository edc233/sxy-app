const app = getApp();
Page({
  data: {
    navList: [
      {
        title: "未开课",
        index: 0,
      },
      {
        title: "待完成",
        index: 1,
      },
      {
        title: "已完成",
        index: 2,
      },
    ],
    activeIndex: 0,
    state: 1,
    page: 1,
    tableData: [],
    total_num: 0,
  },
  onLoad: function () {
    app.setTitle("课程");
    // tt.setTabBarBadge({
    //   index: 0,
    //   text: '99'
    // })
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
    } else {
      this.getList();
    }
  },
  onPullDownRefresh() {
    this.setData({
      page:1
    },() => {
      this.getList()
    })
  },
  getList: function () {
    const that = this;
    tt.showLoading({ title: "加载中" });
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page,
        pageSize: 10,
      },
      success(res) {
        tt.hideLoading();
        tt.stopPullDownRefresh()
        if (res.data.code == 200) {
          that.setData({
            tableData: res.data.data.list,
            total_num: res.data.data.total_count,
          });
        } else {
          app.showToast(res.data.msg);
        }
      },
    });
  },
  handleNav: function (e) {
    this.setData({
      activeIndex: e.target.dataset.id,
      state: e.target.dataset.id + 1,
    });
    this.getList();
  },
});
