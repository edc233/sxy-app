// pages/pc/course/course.js
Page({
  data: {
    src:''
  },
  onLoad: function (options) {
    this.setData({
      src:options.url
    })
  }
})