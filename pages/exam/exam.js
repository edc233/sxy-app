const app = getApp();
Page({
  data: {
    navList: [
      {
        title: "待完成",
        index: 1,
      },
      {
        title: "已完成",
        index: 2,
      },
      {
        title: "已过期",
        index: 3,
      },
    ],
    activeIndex: 1,
    page: 1,
    tableData: [],
    loading: 0,
    loading1: false,
    stop: false,
  },
  onLoad: function (options) {
    app.setTitle("培训");
    this.getList();
  },
  onPullDownRefresh() {
    this.setData(
      {
        page: 1,
      },
      () => {
        this.getList();
      }
    );
  },
  onReachBottom() {
    if (!this.data.stop) {
      const page = this.data.page;
      this.setData(
        {
          page: page + 1,
        },
        () => {
          this.addList();
        }
      );
    }
  },
  getList: function () {
    this.setData({
      loading: 1,
      loading1: false,
      stop: false,
    });
    const that = this;
    app.showLoading("加载中");
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.activeIndex,
        page: that.data.page,
        pageSize: 5,
      },
      success(res) {
        app.hideLoading();
        tt.stopPullDownRefresh();
        if (res.data.code == 200) {
          if(res.data.data.list.length!=0){
            that.setData({
              loading: 2,
              tableData: res.data.data.list,
            });
          }else{
            that.setData({
              loading: 2,
              loading1:true,
              tableData: res.data.data.list,
            });
          }
        }
      },
      fail(res) {
        console.log(`request 调用失败`);
      },
    });
  },
  addList: function () {
    const that = this;
    this.setData({
      loading: 3,
    });
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.activeIndex,
        page: that.data.page,
        pageSize: 5,
      },
      success(res) {
        app.hideLoading();
        if (res.data.code == 200) {
          let list = res.data.data.list;
          if (!list.length) {
            that.setData({
              loading: 2,
              loading1: true,
              stop: true,
            });
            return;
          }
          let list1 = that.data.tableData;
          that.setData({
            loading: 2,
            tableData: list1.concat(...list),
          });
        }
      },
    });
  },
  startExam: function (el) {
    const id = el.target.dataset.id;
    app.navigator("/pages/examDetail/examDetail?id=" + id);
  },
  handleNav: function (e) {
    this.setData(
      {
        activeIndex: e.target.dataset.id,
        page: 1,
      },
      () => {
        this.getList();
      }
    );
  },
});
