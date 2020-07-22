const app = getApp()
Page({
  data: {
    navList:[
      {
        title:'待完成',
        index: 1
      },
      {
        title:'已完成',
        index: 2
      },
      {
        title:'已过期',
        index: 3
      }
    ],
    activeIndex:0,
    state:1,
    page:1,
    tableData:[]
  },
  onLoad: function (options) {
    app.setTitle('培训')
    this.getList()
  },
  getList: function () {
    const that = this
    app.showLoading('加载中');
    tt.request({
      url: app.baseUrl+'/college/Exam/getExamList',
      data: {
        token:tt.getStorageSync('token'),
        state:that.data.state,
        page:that.data.page,
        pageSize:5
      },
      success(res) {
        app.hideLoading()
        if(res.data.code==200){
          that.setData({
            tableData:res.data.data.list
          })
        }
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })
  },
  startExam: function (el) {
    const id = el.target.dataset.id
    app.navigator('/pages/examDetail/examDetail?id='+id)
  },
  handleNav: function (e) {
    this.setData({
      activeIndex:e.target.dataset.id
    })
  }
})