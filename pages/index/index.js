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
    tip:'暂无数据',
    page: 1,
    tableData: [],
    pageSize: 3,
    total_num: 0,
  },
  onLoad: function () {
    app.setTitle("课程");
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
    } else {
       this.getList();
    }
  },
  onShow:function(){
    app.setTitle("课程");
    this.setData({
      page:1
    })
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
    this.setData({
      tip:"加载中"
    })
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page,
        pageSize: that.data.pageSize,
      },
      success(res) {
        tt.stopPullDownRefresh();
        tt.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            tableData: res.data.data.list,
            total_num: res.data.data.list.length,
          });
          if(that.data.total_num==0){
            that.setData({
              tip:"暂无数据"
            });
          }
        } else {
          app.showToast(res.data.msg);
        }
      }
    });
  },
  handleNav: function (e) {
    this.setData({
      activeIndex: e.target.dataset.id,
      state: e.target.dataset.id + 1,
      page: 1,
      tip:"暂无数据",
      total_num:0
    });
    this.getList();
  },
  nextPage: function(){
    const that = this;
    var table=that.data.tableData;
    that.setData({
      page:that.data.page+1
    });
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.state,
        page: that.data.page,
        pageSize: that.data.pageSize,
      },
      success(res) {
        if (res.data.code == 200 && res.data.data.list.length!=0) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            table.push(res.data.data.list[i]) 
          }
          that.setData({
            tableData:table,
            total_num: res.data.data.total_count,
          });
      }
      else if(res.data.data.list.length==0){
        that.setData({
          tip:"加载完毕"
        })
      }
    }
  });
  },
  onReachBottom:function(){
    this.nextPage()
  }
})