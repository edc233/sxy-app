const app = getApp()
Page({
  data: {
    userInfo:{},
    lecturerList:[],
    qrCode:'',
    signList:[]
  },
  onLoad: function (options) {
    this.getUserInfo()
    this.lecturerTask()
  },
  getUserInfo(){
    const that = this
    tt.request({
      url: app.baseUrl + '/college/User/getUserInfo',
      data: {
        token:tt.getStorageSync('token')
      },
      success(res) {
        if(res.data.code==200){
          that.setData({
            userInfo:res.data.data
          })
        }
      },
    })
  },
  lecturerTask(){
    const that = this
    tt.request({
      url: app.baseUrl + '/college/Lecturer/getCollegeList',
      data: {
        token:tt.getStorageSync('token')
      },
      success(res) {
        if(res.data.code==200){
          that.setData({
            lecturerList:res.data.data.list
          })
        }
      },
    })
  },
  getQrcode(e){
    const id = e.currentTarget.dataset.id
    const that = this
    tt.request({
      url: app.baseUrl + '/college/Lecturer/createQrcode',
      data: {
        token:tt.getStorageSync('token'),
        id
      },
      success(res) {
        if(!res.data.code){
          that.setData({
            qrCode:"data:image/png;base64,"+res.data
          })
        }else{
          tt.showToast({
            title: res.data.msg,
            icon: 'warning'
          })
        }
      },
    })
  },
  getSignInfo(e){
    const that = this;
    const id = e.currentTarget.dataset.id
    tt.request({
      url: app.baseUrl + '/college/Lecturer/getNotSigninStaff',
      data: {
        token: tt.getStorageSync('token'),
        id
      },
      success(res) {
        that.setData({
          signList:res.data.data
        })
      },
    })
  },
  done(e){
    const that = this;
    const id = e.currentTarget.dataset.id
    tt.request({
      url: app.baseUrl + '/college/Lecturer/finishCollege',
      data: {
        token:tt.getStorageSync('token'),
        id
      },
      method:"post",
      success(res) {
        if(res.data.code==200){
          tt.showToast({
            title: '操作成功',
            icon: 'success'
          })
          that.lecturerTask()
        }else{
          tt.showToast({
            title: res.data.msg,
            icon: 'warning'
          })
        }
      },
    })
  },
  handleClose(){
    this.setData({
      qrCode:'',
      signList:[]
    })
  }
})