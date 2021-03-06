const app = getApp();
Page({
  data: {
    page: 0,
    tableData: [],
    pageSize: 20,
    total_num: 0,
    department: "",
    avatar: "",
    username: "",
    position: "",
    identity: false,
    test: {},
    islog: false,
    isShow: false,
    navList: [
      {
        title: "我的任务",
        index: 0,
      },
      {
        title: "排行榜",
        index: 1,
      },
    ],
    activeIndex: 0,
    tip: "暂无更多",
  },
  onLoad: function (options) {
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
    }
  },
  onShow: function () {
    app.getNum();
    const that = this;
    if (tt.getStorageSync("token")) {
      tt.request({
        url: app.baseUrl + "/college/User/getUserInfo",
        data: {
          token: tt.getStorageSync("token"),
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              isShow: true,
              username: res.data.data.name,
              department: res.data.data.depart_name,
              avatar: res.data.data.avatar,
              position: res.data.data.position_name,
              islog: true,
            });
            if (res.data.data.lecturer_id > 0) {
              that.setData({
                identity: true,
              });
              tt.setNavigationBarTitle({
                title: "讲师", // 导航栏标题
              });
              that.getMissions();
            } else {
              that.setData({
                identity: false,
              });
            }
          }
        },
      });
    }
    that.setData({
      page: 1,
    });
  },
  go() {
    app.navigator("/pages/pc/index/index");
  },
  handleNav: function (e) {
    this.setData({
      activeIndex: e.target.dataset.id,
      page: 1,
      tip: "暂无更多",
    });
    this.getMissions();
  },
  getMissions: function () {
    var that = this;
    app.getNum();
    tt.showLoading({ title: "加载中" });
    this.setData({
      tip: "加载中",
    });
    tt.request({
      url: app.baseUrl + "/college/Lecturer/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        page: that.data.page,
        pageSize: that.data.pageSize,
      },
      success(res) {
        console.log(res)
        tt.stopPullDownRefresh();
        tt.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            tableData: res.data.data.list,
            total_num: res.data.data.total_count,
          });
          if (res.data.data.list.length <= that.data.total_num) {
            that.setData({
              tip: "暂无更多",
            });
          }
        }
      },
    });
  },
  nextMissons: function () {
    var that = this;
    var table = that.data.tableData;
    tt.showLoading({ title: "加载中" });
    tt.request({
      url: app.baseUrl + "/college/Lecturer/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        page: that.data.page + 1,
        pageSize: that.data.pageSize,
      },
      success(res) {
        tt.hideLoading();
        if (res.data.code == 200 && res.data.data.list.length != 0) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            table.push(res.data.data.list[i]);
          }
          that.setData({
            tableData: table,
            total_num: res.data.data.total_count,
            page: that.data.page + 1,
          });
        } else if (res.data.code != 200||res.data.data.list.length == 0) {
          that.setData({
            tip: "暂无更多",
          });
        }
      },
    });
  },
  onPullDownRefresh() {
    this.setData(
      {
        page: 1,
      },
      () => {
        if (this.data.identity) {
          this.getMissions();
        } else {
          tt.stopPullDownRefresh();
        }
      }
    );
  },
  onReachBottom: function () {
    this.nextMissons();
  },
  getQrcode: function (e) {
    tt.showLoading({
      title: "生成中", // 内容
    });
    tt.request({
      url: app.baseUrl + "/college/Lecturer/createQrcode", // 目标服务器url
      data: {
        token: tt.getStorageSync("token"),
        id: e.currentTarget.dataset.id,
      },
      success: (res) => {
        console.log("data:image/png;base64," + res.data);
        if (!res.data.code) {
          tt.hideLoading();
          app.navigator(
            "/pages/qrcode/qrcode?src=" + "data:image/png;base64," + res.data
          );
        } else {
          tt.hideLoading();
          tt.showModal({
            title: "二维码获取失败",
            content: res.data.msg,
            showCancel: false,
            confirmText: "返回",
            success(res) {
              return;
            },
          });
        }
      },
      fail: (res) => {
        console.log("error");
      },
    });
  },
  getChecked:function(e) {
    app.navigator("/pages/checkList/checkList?id=" + e.currentTarget.dataset.id
          );
  },
  complete: function (e) {
    const that = this
    tt.showModal({
      title: "点击完成",
      content: "请确认该任务是否已完成",
      confirmText: "完成",
      success: (res) => {
        if (res.confirm) {
          tt.request({
            url: app.baseUrl + "/college/Lecturer/finishCollege", // 目标服务器url
            data: {
              token: tt.getStorageSync("token"),
              id: e.currentTarget.dataset.id,
            },
            method: "POST",
            success: (res) => {
              if (res.data.code == 200) {
                tt.showModal({
                  title: "完成",
                  content: "该任务已完成",
                  showCancel: false,
                  success() {
                    that.getMissions()
                  },
                });
              } else {
                tt.showModal({
                  title: "失败",
                  content: res.data.msg,
                  showCancel: false,
                });
              }
            },
            fail: (res) => {
              tt.showModal({
                title: "完成失败",
                content: res.data.msg,
                showCancel: false,
              });
            },
          });
        }
      },
    });
  },
});
