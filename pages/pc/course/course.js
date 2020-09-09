const app = getApp()
Page({
  data: {
    typeList:[],
    selectList:[],
    list:[],
    total_count:0,
    activeIndex:0,
    selectIndex:0,
    totalPage:[],
    pageSize:6,
    page:1
  },
  onLoad: function (options) {
    this.getBigTypeList()
  },
  getBigTypeList(){
    app.showLoading('加载中')
    const that = this
    tt.request({
      url: app.baseUrl + '/college/Course/getBigTypeList',
      data: {
        token:tt.getStorageSync('token')
      },
      success(res) {
        app.hideLoading()
        if(res.data.code==200){
          that.setData({
            typeList:res.data.data,
            activeIndex:res.data.data[0].id
          },() => {
            that.getSelectList()
          })
        }
      },
    })
  },
  getSelectList(){
    app.showLoading('加载中')
    const that = this
    tt.request({
      url: app.baseUrl + '/college/Course/getCourseTypeNumList',
      data: {
        type:that.data.activeIndex,
        token:tt.getStorageSync('token')
      },
      success(res) {
        app.hideLoading()
        if(res.data.code==200){
          if(res.data.data.length!=0){
            that.setData({
              selectList:res.data.data,
              selectIndex:res.data.data[0].id,
            },() => {
              if(res.data.data[0].course_num>0){
                that.getList()
              }else{
                that.setData({
                  list:[],
                  totalPage:[]
                })
              }
            })
          }else{
              that.setData({
                selectList:res.data.data,
                selectIndex:0,
                list:[],
                totalPage:[]
              })
          }
        }
      }
    })
  },
  getList(){
    const that = this
    app.showLoading('加载中')
    tt.request({
      url: app.baseUrl + '/college/Course/getCourseList',
      data: {
        token:tt.getStorageSync('token'),
        type_id:that.data.selectIndex,
        page:that.data.page,
        pageSize:that.data.pageSize
      },
      success(res) {
        app.hideLoading()
        if(res.data.code == 200){
          let p = Math.ceil(res.data.data.total_count/that.data.pageSize)
          let arr = []
          arr[p-1] = 1
          that.setData({
            list:res.data.data.list,
            total_count:res.data.data.total_count,
            totalPage:arr
          })
        }
      },
    })
  },
  handleNav(e){
    const i = e.currentTarget.dataset.i
    if(i!=this.data.activeIndex){
      this.setData({
        activeIndex:i,
        page:1
      },() => {
        this.getSelectList()
      })
    }
  },
  handleSelect(e){
    const i = e.currentTarget.dataset.i
    this.setData({
      selectIndex:i,
      page:1
    },() => {
      this.getList()
    })
  },
  handlePage(e){
    const i = e.currentTarget.dataset.i
    this.setData({
      page:i
    },() => {
      this.getList()
    })
  },
  start(e){
    const CollegeId = '0';
    const courseId = e.currentTarget.dataset.item.id;
    const type = e.currentTarget.dataset.item.property;
    app.navigator( `/pages/course/course?collegeId=${CollegeId}&courseId=${courseId}&type=${type}&pc=1`);
  }
})