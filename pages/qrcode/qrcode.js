const app = getApp()
Page({
  data: {
    src:''
  },
  onLoad: function (options) {
    this.setData({
      src:options.src
    })
  },
  return(){
    app.navigateBack(1)
  }
})