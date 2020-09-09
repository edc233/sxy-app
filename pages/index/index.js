const app = getApp();
Page({
  data: {
    navList: [
      {
        title: "未开始",
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
      {
        title: "已过期",
        index: 3,
      },
    ],
    activeIndex: 0,
    state: 1,
    is_end: 1,
    tip: "暂无数据",
    page: 1,
    tableData: [],
    pageSize: 6,
    total_num: 0,
    isBackFromLogin: false,
  },
  onLoad: function () {
    const updateManager = tt.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res);
    });
    updateManager.onUpdateReady(function () {
      tt.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        },
      });
    });
  },
  onShow: function () {
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
      this.setData({
        tip: "暂未登录，点击登录",
      });
    }
    if (this.data.isBackFromLogin || tt.getStorageSync("token")) {
      this.getList();
      this.setData({
        isBackFromLogin: false,
      });
    }
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
  copyData(e) {
    tt.setClipboardData({
      data: e.currentTarget.dataset.url,
      success(res) {
        tt.showToast({
          title: "复制成功",
          icon: "success",
        });
      },
    });
  },
  getList: function () {
    const that = this;
    app.getNum();
    tt.showLoading({ title: "加载中" });
    this.setData({
      tip: "加载中",
    });
    let data = {};
    if (that.data.activeIndex == 1) {
      data = {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page,
        pageSize: that.data.pageSize,
        is_end: that.data.is_end,
      };
    } else {
      data = {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page,
        pageSize: that.data.pageSize,
      };
    }
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data,
      success(res) {
        tt.stopPullDownRefresh();
        tt.hideLoading();
        if (res.data.code == 200) {
          const list = res.data.data.list;
          list.forEach((el) => {
            if (el.source_url) {
              el.urlList = el.source_url.split("&").map((el) => {
                return {
                  title: el.split("@")[0],
                  url: el.split("@")[1],
                };
              });
            }
          });
          that.setData({
            tableData: list,
            total_num: res.data.data.list.length,
          });
          if (that.data.total_num < that.data.pageSize) {
            that.setData({
              tip: "暂无更多",
            });
          } else {
            that.setData({
              tip: "下拉刷新",
            });
          }
        } else if (res.data.code == 501 || res.data.code == 500) {
          console.log(1123123123);
          tt.showModal({
            title: "提示",
            content: res.data.msg,
            confirmText: "重新登录",
            success(res) {
              if (res.confirm) {
                app.navigator("/pages/login/login");
              }
            },
          });
        } else {
          app.showToast(res.data.msg);
        }
      },
    });
  },
  handleLog: function () {
    if (this.data.tip == "暂未登录，点击登录") {
      app.navigator("/pages/login/login");
    }
  },
  handleNav: function (e) {
    if (tt.getStorageSync("token")) {
      this.setData(
        {
          activeIndex: e.target.dataset.id,
          state: e.target.dataset.id + 1,
          page: 1,
          tableData: [],
          tip: "暂无数据",
          total_num: 0,
        },
        () => {
          this.getList();
        }
      );
    } else {
      this.setData({
        activeIndex: e.target.dataset.id,
        state: e.target.dataset.id + 1,
        page: 1,
        tableData: [],
        tip: "暂未登录，点击登录",
        total_num: 0,
      });
    }
  },
  handleSelect(e) {
    const is_end = e.currentTarget.dataset.idx;
    this.setData(
      {
        is_end,
      },
      () => {
        this.getList();
      }
    );
  },
  nextPage: function () {
    const that = this;
    var table = that.data.tableData;
    let data = {};
    if (that.data.activeIndex == 1) {
      data = {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page + 1,
        pageSize: that.data.pageSize,
        is_end: that.data.is_end,
      };
    } else {
      data = {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page + 1,
        pageSize: that.data.pageSize,
      };
    }
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data: data,
      success(res) {
        if (res.data.code == 200 && res.data.data.list.length != 0) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            table.push(res.data.data.list[i]);
          }
          table.forEach((item) => {
            item.time = item.show_time.split("~")[0];
            item.time1 = item.show_time.split("~")[1];
          });
          that.setData({
            tableData: table,
            page: that.data.page + 1,
            total_num: res.data.data.total_count,
          });
        } else if (res.data.data.list.length == 0) {
          that.setData({
            tip: "加载完毕",
          });
        }
      },
    });
  },
  handleCourse: function (e) {
    const CollegeId = e.currentTarget.dataset.item.college_id;
    const courseId = e.currentTarget.dataset.item.courseInfo.id;
    const type = e.currentTarget.dataset.item.courseInfo.property;
    app.navigator(
      `/pages/course/course?collegeId=${CollegeId}&courseId=${courseId}&type=${type}`
    );
  },
  onReachBottom: function () {
    this.nextPage();
  },
  switchtrain: function (e) {
    console.log(e.currentTarget.dataset);
    if (
      e.currentTarget.dataset.state == 2 &&
      e.currentTarget.dataset.mode == 2 &&
      e.currentTarget.dataset.expired == 0 &&
      !e.currentTarget.dataset.signed
    ) {
      tt.showModal({
        title: "扫码签到",
        content: "扫描二维码进行签到",
        success: (res) => {
          if (res.confirm) {
            app.showLoading();
            tt.scanCode({
              success: (res) => {
                console.log(res);
                tt.request({
                  url: app.baseUrl + "/college/College/signInCollege", // 目标服务器url
                  data: {
                    id: e.currentTarget.dataset.id,
                    college_id: res.result,
                    token: tt.getStorageSync("token"),
                  },
                  method: "POST",
                  success: (res) => {
                    console.log("签到成功");
                    tt.showModal({
                      title: "签到成功",
                      content: "签到已完成",
                      showCancel: false,
                      confirmText: "完成",
                    });
                    this.getList();
                  },
                  fail(res) {
                    tt.showModal({
                      title: "签到失败",
                      content: res.data.msg,
                      showCancel: false,
                      confirmText: "返回",
                      success(res) {
                        return;
                      },
                    });
                  },
                });
              },
              fail(res) {
                tt.openSetting();
              },
            });
            app.hideLoading();
          }
        },
        fail(res) {
          app.hideLoading();
          return;
        },
      });
    } else if (
      e.currentTarget.dataset.state == 2 &&
      e.currentTarget.dataset.lecturer > 0 &&
      e.currentTarget.dataset.expired == 0 &&
      e.currentTarget.dataset.signed &&
      e.currentTarget.dataset.mode == 2
    ) {
      tt.showModal({
        title: "讲师评价",
        content: "是否进入讲师评价页面",
        success: (res) => {
          if (res.confirm) {
            console.log(e.currentTarget.dataset.id);
            tt.navigateTo({
              url: "../evaluate/evaluate?id=" + e.currentTarget.dataset.id, // 指定页面的url
            });
          } else {
            return;
          }
        },
      });
    } else if (
      e.currentTarget.dataset.state == 2 &&
      e.currentTarget.dataset.expired == 0 &&
      e.currentTarget.dataset.signed | (e.currentTarget.dataset.mode == 1)
    ) {
      tt.showModal({
        title: "培训完成",
        content: "是否确认培训任务已完成",
        success: (res) => {
          if (res.confirm) {
            app.showLoading(" ");
            tt.request({
              url: app.baseUrl + "/college/College/finishCollege", // 目标服务器url
              method: "POST",
              data: {
                token: tt.getStorageSync("token"),
                id: e.currentTarget.dataset.id,
              },
              success: (res) => {
                app.hideLoading();
                console.log(res.data.code);
                if (res.data.code == 200) {
                  this.setData(
                    {
                      page: 1,
                    },
                    () => {
                      tt.showModal({
                        title: "已完成", // 内容
                        content: "培训任务已完成",
                        showCancel: false,
                        confirmText: "返回",
                        success: (res) => {
                          this.getList();
                        },
                      });
                    }
                  );
                } else {
                  tt.showModal({
                    title: "签到失败",
                    content: res.data.msg,
                    showCancel: false,
                    confirmText: "返回",
                    success(res) {
                      return;
                    },
                  });
                }
              },
              fail(res) {
                console.log(res);
              },
            });
          }
        },
      });
    }
  },
  handleLearn(e) {
    const url = e.currentTarget.dataset.url;
    tt.openSchema({
      schema: url,
      external: false,
    });
  },
});
