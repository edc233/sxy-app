const app = getApp();
Page({
  data: {
    page: 0,
    tableData: [],
    pageSize: 3,
    total_num: 0,
    isLog: true,
    username: "",
    department: "",
    avatar: "",
    position: "",
    identity: false,
    test:{},
    navList:[
      {
        title:'我的任务',
        index: 0
      },
      {
        title:'排行榜',
        index: 1
      }
    ],
    activeIndex:0,
    tip:"暂无数据",
  },
  onLoad: function (options) {
    app.setTitle("学员信息");
  },
  onShow: function () {
    const that = this;
    that.setData({
      page:1
    })
    if (this.data.username) {
      if(this.identity>0){
        this.getMissions()
        return
      }
    } else if (
      !this.data.username && tt.getStorageSync("token")) {
      tt.request({
        url: app.baseUrl + "/college/User/getUserInfo",
        data: {
          token: tt.getStorageSync("token"),
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              username: res.data.data.name,
              department: res.data.data.depart_name,
              avatar: res.data.data.avatar,
              position: res.data.data.position_name,
            });
            if(res.data.data.lecture_id>0){
              this.getMissions()
              that.setData({
                identity: true,
              });
              tt.setNavigationBarTitle({
                title: '讲师' // 导航栏标题
              });
            }
          }
        },
      });
    } else {
      this.setData({
        isLog: false,
      });
    }
  },
  handleLogin: function () {
    app.navigator("/pages/login/login");
  },
  handleNav: function (e) {
    this.setData({
      activeIndex:e.target.dataset.id,
      page: 1,
      tip:"暂无数据"
    }) 
    this.getMissions();
  },
  getMissions: function(){
    var that =this
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
          if(res.data.data.list.length<this.data.total_num){
            this.setData({
              tip:'加载完成'
            })
          }
        }
      }
    })
  },
  nextMissons: function(){
    var that = this
    var table=that.data.tableData;
    tt.showLoading({ title: "加载中" });
    tt.request({
      url: app.baseUrl +'/college/Lecturer/getCollegeList',
      data: {
        token:tt.getStorageSync("token"),
        page:that.data.page+1,
        pageSize:that.data.pageSize,
      },
      success(res) {
        tt.hideLoading();
        if (res.data.code == 200 && res.data.data.list.length!=0) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            table.push(res.data.data.list[i]) 
          }
          that.setData({
            tableData:table,
            total_num: res.data.data.total_count,
            page:that.data.page+1
          });
      }
      else if(res.data.data.list.length==0){
        that.setData({
          tip:"加载完毕"
        })
      }
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })
  } ,
  onPullDownRefresh() {
    this.setData({
      page:1
    },
    () => {
      if(this.data.identity){
        this.getMissions()
      }else{
        tt.stopPullDownRefresh();
      }
    })
  },
  onReachBottom:function(){
    this.nextMissons()
  },
  getQrcode:function(e){
    console.log(e.currentTarget.dataset.id)
    tt.request({
      url: app.baseUrl+'/college/Lecturer/createQrcode', // 目标服务器url
      data:{
        token:tt.getStorageSync("token"),
        id:e.currentTarget.dataset.id
      },
      success: (res) => {
            this.setData({
            test:"data:image/png;base64,"+res.data
            })
        tt.previewImage({
          urls: [this.data.test], // 图片地址列表
        });
      }
    });
  }
});
