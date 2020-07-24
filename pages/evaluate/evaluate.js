const app = getApp();
Page({
  data: {
    tableData: [],
    len: 0,
    isReady: false,
    answer: [
    ],
  },
  onLoad: function (options) {
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
          console.log(res.data.data);
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
    }
  }
});
