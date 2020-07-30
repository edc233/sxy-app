const app = getApp();
Page({
  data: {
    tableData: [],
    len: 0,
    isReady: false,
    answer: [
    ],
    id: 0,
  },
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    console.log(this.data.id)
    this.getEvaluate();
    app.setTitle("讲师评价");
  },
  getEvaluate: function () {
    app.showLoading("加载中");
    const that = this;
    tt.request({
      url: app.baseUrl + "/college/College/getLecturerIssue",
      data: {
        token: tt.getStorageSync("token"),
      },
      success(res) {
        app.hideLoading();
        if (res.data.code == 200) {
          let len = 0;
          res.data.data.map((element) => {
            if (element.type == 2) {
              len++;
            } else {
              len += element.children.length;
            }
          });
          that.setData({
            tableData: res.data.data,
            len,
            isReady: true,
          });
        } else {
          tt.showModal({
            title: "错误",
            content: res.data.msg,
            showCancel: false,
          });
        }
      },
    });
  },
  handleChange: function (e) {
    const id = e.target.dataset.id;
    const value = e.detail.value;
    let list = this.data.answer;
    const l = list.filter((el) => {
      return el.id == id;
    })
    if(l!=0){
      list.forEach(element => {
        if(element.id==id){
          element.content=value
        }
      });
    }else{
      list.push({
        id,content:value
      })
    }
    this.setData({
      answer:list
    })
  },
  submit: function () {
    const list = this.data.answer
    const len = this.data.len
    if(list.length!=len){
      app.showToast('还有未填的选项，请先完善','error')
    }else{
      tt.showModal({
        title:"提交评价",
        content:"是否确认提交本次讲师评价",
        success: (res) => {
          if(res.confirm){
            tt.request({
              url: app.baseUrl+'/college/College/addLecturerIssue', // 目标服务器url
              method:"POST",
              data:{
                token: tt.getStorageSync("token"),
                id:this.data.id,
                answer:JSON.stringify(this.data.answer)
              },
              success: (res) => {
                console.log(res)
                tt.navigateBack();
              }
            });
          }else{
            return
          }
        }
      });


    }
  }
});
