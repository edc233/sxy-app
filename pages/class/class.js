const app = getApp();
Page({
  data: {
    courseList:[],
    bigType: [],
    smType:[],
    navActive: 0,
    smActive:0,
    page:1,
    totalNum:0,
    notice:'加载中'
  },
  onLoad: function (options) {
    if(!tt.getStorageSync('token')){
      app.navigator('/pages/login/login')
    }else{
      this.getBigTypeList();
    }
  },
  onPullDownRefresh: function() { 
    this.setData({
      page:1
    },() => {
      this.getSmTypeList(this.data.bigType[this.data.navActive].id)
    })
  },
  onReachBottom: function() {
    const {courseList,totalNum,page,notice} = this.data
    if(courseList.length<totalNum&&notice!='暂无更多课程'){
      this.setData({
        page:page+1
      },()=>{
        this.getList()
      })
    }else{
      this.setData({
        notice:'暂无更多课程'
      })
    }
  },
  //获取顶部大类列表
  getBigTypeList() {
    const that = this;
    that.setData({
      notice:'加载中',
      courseList:[]
    })
    tt.request({
      url: app.baseUrl + "/college/Course/getBigTypeList",
      data: {
        token: tt.getStorageSync("token"),
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            bigType: res.data.data,
          });
          if(res.data.data.length!=0){
            that.getSmTypeList(res.data.data[0].id)
          }
        } else {
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
        }
      },
    });
  },
  //获取小类列表
  getSmTypeList(type) {
    const that = this
    that.setData({
      notice:'加载中',
      courseList:[]
    })
    app.showLoading('加载中')
    tt.request({
      url: app.baseUrl + "/college/Course/getCourseTypeNumList",
      data: {
        token: tt.getStorageSync("token"),
        type,
      },
      success(res) {
        tt.stopPullDownRefresh()
        if(res.data.code==200 && res.data.data.length != 0){
          that.setData({
            smType:res.data.data,
            smActive:res.data.data[0].id
          },() => {
            that.getList()
          })
        }else{
          app.hideLoading()
          that.setData({
            smType:[],
            smActive:'',
            notice:'暂无更多课程'
          })
        }
      },
    });
  },
  //获取课程列表
  getList(){
    const that = this
    app.showLoading('加载中')
    that.setData({
      notice:'加载中'
    })
    tt.request({
      url: app.baseUrl+'/college/Course/getCourseList',
      data: {
        token:tt.getStorageSync('token'),
        type_id:that.data.smActive,
        page:that.data.page,
        pageSize:5
      },
      success(res) {
        tt.stopPullDownRefresh()
        app.hideLoading()
        if(res.data.code==200){
          const list = res.data.data.list
          if(that.data.page==1){
            if(res.data.data.total_count<=5){
              that.setData({
                courseList:list,
                totalNum:res.data.data.total_count,
                notice:'暂无更多课程'
              })
            }else{
              that.setData({
                courseList:list,
                totalNum:res.data.data.total_count,
                notice:''
              })
            }
          }else{
            let list1 = that.data.courseList
            that.setData({
              courseList:list1.concat(...list),
              notice:''
            })
          }
        }
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })
  },
  handleNav(e) {
    const i  = e.currentTarget.dataset.index
    const id  = e.currentTarget.dataset.id
    if (i != this.data.navActive) {
      this.setData({
        navActive: i,
        page:1
      });
      this.getSmTypeList(id);
    }
  },
  handleSelect(e){
    if(e.currentTarget.dataset.id != this.data.smActive){
      this.setData({
        smActive:e.currentTarget.dataset.id,
        page:1
      })
      this.getList(e.currentTarget.dataset.id)
    }
  },
  start(e){
    const CollegeId = '0';
    const courseId = e.currentTarget.dataset.item.id;
    const type = e.currentTarget.dataset.item.property;
    app.navigator( `/pages/course/course?collegeId=${CollegeId}&courseId=${courseId}&type=${type}&pc=0`);
  }
});
