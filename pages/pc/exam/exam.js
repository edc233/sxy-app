const app = getApp();
Page({
  data: {
    activeIndex: 1,
    navList: [
      {
        title: "待完成",
        id: 1,
      },
      {
        title: "已完成",
        id: 2,
      },
      {
        title: "已过期",
        id: 3,
      },
    ],
    notice: "加载中",
    page: 1,
    list: [],
    total_num: 0,
  },
  onLoad: function (options) {
    this.getList();
  },
  onReachBottom() {
    const { notice, page } = this.data;
    if (notice == "") {
      this.setData(
        {
          page: page + 1,
        },
        () => {
          this.getList();
        }
      );
    }
  },
  //控制导航栏
  handleNav(e) {
    const index = e.currentTarget.dataset.index;
    if (index != this.data.activeIndex) {
      this.setData(
        {
          activeIndex: index,
          list: [],
          page: 1,
          notice: "加载中",
        },
        () => {
          this.getList();
        }
      );
    }
  },
  getList() {
    app.showLoading("加载中");
    this.setData({
      notice: "加载中",
    });
    const that = this;
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.activeIndex,
        pageSize: 5,
        page: that.data.page,
      },
      success(res) {
        app.hideLoading();
        if (res.data.code == 200) {
          const { list, total_count } = res.data.data;
          const olist = that.data.list;
          if (that.data.page == 1) {
            that.setData({
              list: list,
              notice: total_count == list.length ? "暂无更多考试" : "",
            });
          } else {
            that.setData({
              list: olist.concat(...list),
              notice:
                total_count == list.length + olist.length ? "暂无更多考试" : "",
            });
          }
        }
      },
    });
  },
});
