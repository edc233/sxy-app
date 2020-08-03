const app = getApp();
Page({
  data: {
    topList: [
      {
        title: "培训",
        index: 1,
      },
      {
        title: "考试",
        index: 2,
      },
      {
        title: "任务",
        index: 3,
      },
    ],
    leftList: [
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
    ],
    tableData: [],
    topActiveIndex: 1, //顶部导航激活
    leftActive: 1, //左边导航激活
    page:1,
    pageSize:99,
    total_num:0
  },
  onLoad: function (options) {
    this.getList()
  },
  handleTopNav: function (e) {
    const index = e.currentTarget.dataset.index;
    if (index == 1) {
      var list = [
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
      ];
    } else if (index == 2) {
      var list = [
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
      ];
    }else{
      var list = [
        {
          title:'任务',
          id:1
        }
      ]
    }
    this.setData({
      topActiveIndex: index,
      leftList: list,
      tableData:[],
      leftActive:1
    });
    console.log(this.data.topActiveIndex)
    this.getlist()
  },
  handLeftNav: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      leftActive: index,
    });
    this.getlist()
  },
  getList: function () {
    const that = this;
    app.getNum()
    tt.showLoading({ title: "加载中" });
    this.setData({
      tip:"加载中"
    })
    tt.request({
      url: app.baseUrl + "/college/College/getCollegeList",
      data: {
        token: tt.getStorageSync("token"),
        state: that.data.leftActive,
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
          if(that.data.total_num<that.data.pageSize){
            that.setData({
              tip:"暂无更多"
            });
          }
        } else {
          that.setData({
            tip:"下拉刷新"
          })
          app.showToast(res.data.msg);
        }
      },fail(res){
        console.log(res.data)
      }
    });
  }, 
  getList1: function () {
    app.getNum()
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
        state: that.data.leftActive,
        page: that.data.page,
        pageSize: that.data.pageSize,
      },
      success(res) {
        app.hideLoading();
        tt.stopPullDownRefresh();
        if (res.data.code == 200) {
          if (res.data.data.list.length != 0) {
            that.setData({
              loading: 2,
              tableData: res.data.data.list,
            });
          } else {
            that.setData({
              loading: 2,
              loading1: true,
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
  getMissions: function(){
    var that =this
    app.getNum()
    tt.showLoading({ title: "加载中" });
    this.setData({
      tip:"加载中"
    })
    tt.request({
      url:app.baseUrl + '/college/Lecturer/getCollegeList',
      data: {
        token:tt.getStorageSync("token"),
        page:that.data.page,
        pageSize:that.data.pageSize,
      },
      success(res) {
        tt.stopPullDownRefresh();
        tt.hideLoading();
        if(res.data.code==200){
          that.setData({
            tableData:res.data.data.list,
            total_num:res.data.data.total_count,
          });
          if(res.data.data.list.length<=that.data.total_num){
            that.setData({
              tip:'暂无更多'
            })
          }
        }
      }
    })
  },
  getlist(){
    if(this.data.topActiveIndex==1){
      this.getList()
    }else if(this.data.topActiveIndex==2){
      this.getList1()
    }else{
      this.getMissions()
    }
  },
  notice(){
    tt.showModal({
      title: "电脑端提示",
      content: "如需更多功能，烦请使用手机端打开本小程序",
      showCancel:false,
      confirmText:"我已知晓",
    });
  }
});
