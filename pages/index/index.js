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
    pageSize: 6,
    total_num: 0,
  },
  onLoad: function () {
    app.setTitle("课程");
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
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
    app.getNum()
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
      }
    });
  },
  handleNav: function (e) {
    this.setData({
      activeIndex: e.target.dataset.id,
      state: e.target.dataset.id + 1,
      page: 1,
      tableData:[],
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
  },
  switchtrain:function(e){
    if(e.currentTarget.dataset.state==2&&
    e.currentTarget.dataset.mode==2&&
    e.currentTarget.dataset.expired==0){
      tt.showModal({
        title:"扫码签到",
        content:"扫描二维码进行签到",
        success: (res) => {
          app.showLoading()
          tt.scanCode({
            success: (res) => {
              console.log(res)
              tt.request({
                url: app.baseUrl+'/college/College/signInCollege', // 目标服务器url
                data:{
                  id: e.currentTarget.dataset.id,
                  college_id:res.result,
                },
                success: (res) => {
                  console.log("签到成功")
                  console.log(res)
                  tt.showModal({
                    title:"签到成功",
                    content:"签到已完成",
                    showCancel:false,
                    confirmText:"完成"
                  });
                  this.getList()
                },fail(res){
                  tt.showModal({
                    title:"签到失败",
                    content:res.data.msg,
                    showCancel:false,
                    confirmText:"返回",
                    success(res){
                      return
                    }
                  });
                }
              });
            },fail(res){
              tt.openSetting()
            }
          });
          app.hideLoading()
        },
        fail(res){
          app.hideLoading()
          return
        }
      });
    }else if(e.currentTarget.dataset.state==2&&
    e.currentTarget.dataset.lecturer>0&&
    e.currentTarget.dataset.expired==0){
      console.log(e.currentTarget.dataset.id)
      tt.navigateTo({
        url: '../evaluate/evaluate?id='+e.currentTarget.dataset.id// 指定页面的url
      });
    }else if(e.currentTarget.dataset.state==2&&
    e.currentTarget.dataset.expired==0){
      tt.request({
        url: app.baseUrl+'/college/College/finishCollege', // 目标服务器url
        method:"POST",
        data:{
          token: tt.getStorageSync("token"),
          id: e.currentTarget.dataset.id
        },
        success: (res) => {
          this.setData({
            page:1
            },() => {
              console.log(res)
              this.getList()
              })
          },fail(res){
            console.log(res)

          }
      });
    }
  }
})