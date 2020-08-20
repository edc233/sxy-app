// pages/course/course.js
Page({
  data: {
    src:'',
    baseUrl:'http://192.168.111.30:8080'
  },
  onLoad: function (options) {
    
    let url = `${this.data.baseUrl}?token=${tt.getStorageSync('token')}&collegeId=${options.collegeId}&courseId=${options.courseId}&type=${options.type}`
    console.log(url)
    this.setData({
      src:url
    })
  }
})