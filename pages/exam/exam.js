const app = getApp()
Page({
  data: {
    navList:[
      {
        title:'未开始',
        index: 0
      },
      {
        title:'待完成',
        index: 1
      },
      {
        title:'已完成',
        index: 2
      }
    ],
    activeIndex:0
  },
  onLoad: function (options) {
    app.setTitle('培训')
  },
  handleNav: function (e) {
    this.setData({
      activeIndex:e.target.dataset.id
    })
  }
})