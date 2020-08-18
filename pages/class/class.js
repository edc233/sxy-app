const app = getApp();
Page({
  data: {
    navList: [
      {
        title: "抖音",
        index: 0,
      },
      {
        title: "头条",
        index: 1,
      },
      {
        title: "后台",
        index: 2,
      },
    ],
    page:1,
    
    activeIndex: 0,
    navLeft:[],
    activeLeft:0,
    leftId:0,
    total_num: 0,
    tip:"暂无更多",
    pageSize: 5,
    tableData:[],

  },
  onLoad: function (options) {// tt.clearStorageSync('token')
    if (!tt.getStorageSync("token")) {
      app.navigator("/pages/login/login");
      this.setData({
        tip:'暂未登录，点击登录'
      })
    }else{
      this.getTypeList();
    }
    const updateManager = tt.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate);
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
  onShow:function(options){
    this.getTypeList();
  },
  onPullDownRefresh() {
    this.setData({
      page:1
    },() => {
      this.getList()
    })
  },
  getTypeList:function(e){
    app.getNum()
    tt.showLoading({
      title: '加载中', // 内容
    });
    tt.request({
      url: app.baseUrl+'/college/Course/getCourseTypeNumList', // 目标服务器url
      method:'get',
      data:{
        type:this.data.activeIndex+1,
        token: tt.getStorageSync("token"),
      },
      success: (res) => {
        tt.hideLoading();
        if(res.data.code==200){
          var list = res.data.data;
          for(var ele in list){
            list[ele].index = ele;
          }
          this.setData({
            navLeft:res.data.data,
            activeLeft:res.data.data[0].index,
            leftId:res.data.data[0].id
          });
         this.getList();
      }
    }
    })
    },
  getList:function(e){
    tt.showLoading({
      title: '加载中', // 内容
    });
    this.setData({
      tip:"加载中"
    })
    tt.request({
      url: app.baseUrl+'/college/Course/getCourseList', // 目标服务器url
      method:'get',
      data:{
        page:this.data.page,
        pageSize:this.data.pageSize,
        type_id:this.data.leftId,
        token: tt.getStorageSync("token"),
      },
      success: (res) => {
          tt.stopPullDownRefresh();
          tt.hideLoading();
        if(res.data.code==200){
          this.setData({
            tableData:res.data.data.list,
            total_num: res.data.data.list.length,
          }) 
          if(this.data.total_num<this.data.pageSize){
              this.setData({
                tip:"暂无更多"
              });
            }else{
            this.setData({
              tip:"下拉加载"
            })
          }
        }else{
          app.showToast(res.data.msg);
        }
      }
    })
  },
  handleNav: function (e) {
    this.setData(
      {
        activeIndex: e.target.dataset.id,
        page: 1,
      },
    );
    this.getTypeList();
  },
   handleNav1: function (e) {
    this.setData(
      {
        leftId:e.target.dataset.id,
        activeLeft: e.target.dataset.index,
        page: 1,
      },
    );
    this.getList();
  },

  nextPage: function(){
    const that = this;
    var table=that.data.tableData;
    that.setData({
      page:that.data.page+1
    });
    tt.request({
      url: app.baseUrl + "/college/Course/getCourseList",
      data: {
        page:this.data.page,
        pageSize:this.data.pageSize,
        type_id:this.data.leftId,
        token: tt.getStorageSync("token"),
      },
      success(res) {
        if (res.data.code == 200) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            table.push(res.data.data.list[i]) 
          }
          that.setData({
            tableData:table,
            total_num: res.data.data.total_count,
          });
      }if(res.data.data.list.length<that.data.pageSize){
        that.setData({
          tip:"暂无更多"
        })
      }
    }
  });
  },
  onReachBottom:function(){
    this.nextPage()
  },
})

