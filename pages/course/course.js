// pages/course/course.js
Page({
  data: {
    src:'',
    baseUrl:'http://h5.headlinetop.com/courseView/',
    baseUrl1:'http://h5.headlinetop.com/coursePC/',
    // baseUrl:'http://192.168.111.30:8080'
  },
  onLoad: function (options) {
    let url = ''
    if(options.pc==1){
      url = `${this.data.baseUrl1}?token=${tt.getStorageSync('token')}&collegeId=${options.collegeId}&courseId=${options.courseId}&type=${options.type}`
    }else{
      url = `${this.data.baseUrl}?token=${tt.getStorageSync('token')}&collegeId=${options.collegeId}&courseId=${options.courseId}&type=${options.type}`
    }
    console.log(url)
    this.setData({
      src:url
    })
  }
})