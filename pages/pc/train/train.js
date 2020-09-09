const app = getApp();
Page({
  data: {
    activeIndex: 1,
    page: 1,
    navList: [
      {
        title: "未开课",
        id: 1,
      },
      {
        title: "待完成",
        id: 2,
      },
      {
        title: "已完成",
        id: 3,
      },
      {
        title: "已过期",
        id: 4,
      },
    ],
    is_end: 1,
    list: [],
    total_count: 0,
    notice: "加载中",
  },
  onLoad: function (options) {},
  onShow() {
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
        },
        () => {
          this.getList();
        }
      );
    }
  },
  handleSelect(e) {
    const i = e.currentTarget.dataset.idx;
    this.setData(
      {
        is_end: i,
      },
      () => {
        this.getList();
      }
    );
  },
  //获取列表
  getList() {
    app.showLoading("加载中");
    this.setData({
      notice: "加载中",
    });
    const that = this;
    const { activeIndex, page, is_end } = this.data;
    let data = {};
    if (activeIndex == 2) {
      data = {
        token: tt.getStorageSync("token"),
        state: activeIndex,
        page,
        pageSize: 5,
        is_end: is_end,
      };
    } else {
      data = {
        token: tt.getStorageSync("token"),
        state: activeIndex,
        page,
        pageSize: 5,
      };
    }
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data,
      success(res) {
        app.hideLoading();
        if (res.data.code == 200) {
          const { list, total_count } = res.data.data;
          const olist = that.data.list;
          if (page == 1) {
            let arr = list;
            arr.forEach((element) => {
              if (element.source_url) {
                element.urlList = element.source_url.split("&").map((el) => {
                  return {
                    title: el.split("@")[0],
                    url: el.split("@")[1],
                  };
                });
              }
            });
            that.setData({
              list: arr,
              notice: total_count == list.length ? "暂无更多培训" : "",
            });
          } else {
            let arr = olist.concat(...list);
            arr.forEach((element) => {
              if (element.source_url) {
                element.urlList = element.source_url.split("&").map((el) => {
                  return {
                    title: el.split("@")[0],
                    url: el.split("@")[1],
                  };
                });
              }
            });
            that.setData({
              list: arr,
              notice:
                total_count == list.length + olist.length ? "暂无更多培训" : "",
            });
          }
        }
      },
    });
  },
  handleLearn(e) {
    const url = e.currentTarget.dataset.url;
    tt.openSchema({
      schema: url,
      external: false,
    });
  },
});
