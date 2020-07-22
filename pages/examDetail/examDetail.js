const app = getApp();
Page({
  data: {
    tableData: {},
    isReady: false,
    hour: 0,
    minutes: "00",
    answerList: [],
    len: 0,
    score: 0,
    block: false,
  },
  onLoad: function (options) {
    app.setTitle("开始考试");
    this.getPaper();
  },
  getPaper: function () {
    const that = this;
    app.showLoading("加载中");
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamPaper",
      data: {
        id: 2,
        token: tt.getStorageSync("token"),
      },
      success(res) {
        app.hideToast();
        if (res.data.code == 200) {
          let obj = res.data.data;
          obj.question.forEach((el) => {
            let str=''
            el.answer.forEach((as, i) => {
              if (as.is_correct == 1) {
                let s = i==0?'A':i==1?'B':i==2?'C':'D'
                str=str+''+s
              }
              el.right = str;
            });
          });
          console.log(obj.question)
          that.setData(
            {
              isReady: true,
              tableData: obj,
              hour: res.data.data.time_length,
            },
            () => {
              that.countDown();
            }
          );
        } else {
          app.showToast(res.data.msg);
        }
      },
    });
  },
  countDown: function () {
    let time = parseInt(this.data.tableData.time_length) * 60;
    setInterval(() => {
      if (time > 0) {
        time--;
        let hour = parseInt(time / 60);
        let minutes = time % 60 < 10 ? "0" + (time % 60) : time % 60;
        this.setData({
          hour,
          minutes,
        });
      }
    }, 1000);
  },
  submit: function () {
    const that = this;
    if (this.data.len < this.data.tableData.question.length) {
      tt.showModal({
        title: "提示",
        content: "未答完所有题目，是否提交试卷？",
        confirmText: "提交",
        showCancel: true,
        cancelText: "继续答题",
        success: function (res) {
          if (res.confirm) {
            that.checkPaper();
          }
        },
      });
    }
  },
  checkPaper: function () {
    app.showLoading("提交中");
    // this.setData({
    //   block: true,
    // });
    const tableData = this.data.tableData;
    const answerList = this.data.answerList;
    let score = this.data.score;
    tableData.question.forEach((element, i) => {
      if (answerList[i]) {
        if (element.property != 2) {
          if (element.answer[answerList[i]].is_correct == 1) {
            score += element.score;
            element.isRight = 2;
          } else {
            element.isRight = 1;
          }
        } else {
          answerList[i].forEach((el) => {
            if (element.answer[el].is_correct == 0) {
              element.isRight = 1;
              return
            }
            console.log(1111)
            element.isRight = 2;
          });
        }
      } else {
        element.isRight = 1;
      }
    });
    this.setData(
      {
        tableData,
      },
      () => {
        app.hideLoading();
      }
    );
  },
  handleChange: function (e) {
    const answer = e.detail.value;
    const index = e.target.dataset.index;
    let list = this.data.answerList;
    list[index] = answer;
    var len = list.filter(function (s) {
      if (Array.isArray(s)) {
        return s && s.length != 0;
      } else {
        return s && s.trim();
      }
    }).length;
    this.setData({
      answerList: list,
      len,
    });
  },
  handleChange1: function (e) {
    const answer = e.detail.value;
    const index = e.target.dataset.index;
    let list = this.data.answerList;
    list[index] = answer;
    var len = list.filter(function (s) {
      if (Array.isArray(s)) {
        return s && s.length != 0;
      } else {
        return s && s.trim();
      }
    }).length;
    this.setData({
      answerList: list,
      len,
    });
  },
});
