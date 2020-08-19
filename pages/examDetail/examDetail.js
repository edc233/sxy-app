const app = getApp();
let timer = null;
let timer2 = null;
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
    id: "",
    time: 0,
    second: 10,
    content: "关闭提示，开始答题",
    showNote: true,
    showScore: false,
    win_scrollTop: 0,
    warningSeconds: 11,
  },
  onLoad: function (options) {
    this.setData(
      {
        // id: options.id,
        id: "25",
      },
      () => {
        app.setTitle("开始考试");
        this.getPaper();
      }
    );
    let time = setInterval(() => {
      const s = this.data.second;
      this.setData(
        {
          second: s - 1,
          content: `关闭提示，开始答题(${s - 1}s)`,
        },
        () => {
          if (s == 1) {
            this.setData({
              second: "",
              content: "关闭提示，开始答题",
            });
            clearInterval(time);
            return;
          }
        }
      );
    }, 1000);
  },
  onShow: function () {
    const t = this.data.time;
    this.setData(
      {
        time: t + 1,
      },
      () => {
        if (this.data.time > 1) {
          tt.showModal({
            title: "警告",
            content: "检测到切屏，即将自动提交试卷",
          });
          this.checkPaper();
        }
      }
    );
  },
  onUnload: function () {
    const tableData = this.data.tableData;
    let answer = {};
    tableData.question.forEach((element, i) => {
      answer[element.id] = "";
    });
    this.sendAnswer(JSON.stringify(answer), this.data.tableData.id);
  },
  onPageScroll: function () {
    clearTimeout(timer);
    clearInterval(timer2)
    this.setData({
      warningSeconds:11
    })
    timer = setTimeout(() => {
      console.log(123123123)
      this.showWarning()
    }, 30000);
  },
  showWarning: function () {
    timer2 = setInterval(() => {
      const s = this.data.warningSeconds;
      if(s==0){
        this.checkPaper()
        clearInterval(timer2);
      }else{
        this.setData({
          warningSeconds: s - 1,
        });
      }
    }, 1000);
  },
  close: function () {
    if (this.data.second == "") {
      this.setData(
        {
          showNote: false,
        },
        () => {
          this.countDown();
        }
      );
    }
  },
  getPaper: function () {
    const that = this;
    app.showLoading("加载中");
    tt.request({
      url: app.baseUrl + "/college/Exam/getExamPaper",
      data: {
        id: that.data.id,
        token: tt.getStorageSync("token"),
      },
      success(res) {
        app.hideToast();
        if (res.data.code == 200) {
          let obj = res.data.data;
          obj.question.forEach((el) => {
            let str = "";
            el.answer.forEach((as, i) => {
              if (as.is_correct == 1) {
                let s = i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : "D";
                str = str + "" + s;
              }
              el.right = str;
            });
          });
          that.setData(
            {
              isReady: true,
              tableData: obj,
              hour: res.data.data.time_length,
            },
            () => {
              // that.countDown();
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
    var cdown = setInterval(() => {
      if (time > 0 && this.data.block == false) {
        time--;
        let hour = parseInt(time / 60);
        let minutes = time % 60 < 10 ? "0" + (time % 60) : time % 60;
        this.setData({
          hour,
          minutes,
        });
      } else if (time <= 0) {
        this.checkPaper();
      }
    }, 1000);
  },
  exit: function () {
    tt.showModal({
      title: "警告",
      content: "退出考试将自动结束考试并记零分，请确认是否退出考试",
      confirmText: "确认退出",
      cancelText: "返回答题",
      success(res) {
        if (res.confirm) {
          app.navigateBack();
        }
      },
    });
  },
  submit: function () {
    const that = this;
    if (this.data.len < this.data.tableData.question.length) {
      tt.showModal({
        title: "提示",
        content: "未答完所有题目，不可提交",
        confirmText: "我已知晓",
        showCancel: false,
        success: function (res) {},
      });
    } else if (this.data.block == false) {
      tt.showModal({
        title: "提示",
        content:
          "所有题目均已做完，您确认提交吗？本次考试限考一次，提交后不可重考",
        confirmText: "提交",
        showCancel: true,
        cancelText: "继续答题",
        success: function (res) {
          if (res.confirm) {
            that.checkPaper();
          }
        },
      });
    } else {
      tt.showModal({
        title: "提示",
        confirmText: "我已知晓",
        showCancel: false,
        content: "不可重复提交",
        success: (res) => {},
      });
    }
  },
  checkPaper: function () {
    console.log(999);
    this.setData({
      block: true,
    });
    const tableData = this.data.tableData;
    const answerList = this.data.answerList;
    let answer = {};
    let score = this.data.score;
    tableData.question.forEach((element, i) => {
      if (answerList[i]) {
        if (element.property != 2) {
          answer[element.id] = element.answer[answerList[i]].id + "";
          if (element.answer[answerList[i]].is_correct == 1) {
            score += element.score;
            element.isRight = 2;
          } else {
            element.isRight = 1;
          }
        } else {
          answer[element.id] = answerList[i]
            .map((x) => {
              return element.answer[x].id;
            })
            .join("@");
          let choose = JSON.stringify(answerList[i].sort());
          let list = [];
          element.answer.forEach((el, i) => {
            if (el.is_correct == 1) {
              list.push(i + "");
            }
          });
          if (JSON.stringify(list.sort()) == choose) {
            element.isRight = 2;
            score += element.score;
          } else {
            element.isRight = 1;
          }
        }
      } else {
        element.isRight = 1;
        answer[element.id] = "";
      }
    });
    this.setData(
      {
        score,
        tableData,
        showScore: true,
      },
      () => {
        this.sendAnswer(JSON.stringify(answer), this.data.tableData.id);
      }
    );
    tt.pageScrollTo({
      scrollTop: 0 // 目标位置
    });       
  },
  sendAnswer: function (answer, id) {
    app.showLoading("提交中");
    const that = this;
    tt.request({
      url: app.baseUrl + "/college/Exam/finishExamPaper",
      data: {
        token: tt.getStorageSync("token"),
        answer,
        id: that.data.id,
      },
      method: "POST",
      header: {
        "content-type": "application/json",
      },
      success(res) {
        app.hideLoading();
        if (res.data.code == 200) {
          app.showToast("试卷提交成功");
        } else {
          tt.showModal({
            title: "提示",
            content: res.data.msg,
            confirmText: "确定",
            showCancel: false,
          });
        }
      },
    });
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
