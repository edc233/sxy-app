// pages/class/class.js
Page({
  data: {
    navList: [
      {
        title: "抖音",
        index: 0,
      },
      {
        title: "头条",
        index: 1,
      },
      {
        title: "后台",
        index: 2,
      },
    ],
    activeIndex: 0,
    navLeft:[{
        title: "抖音",
        index: 0,
      },
      {
        title: "头条",
        index: 1,
      },
      {
        title: "后台",
        index: 2,
      }],
    activeLeft:0,
    tableData:[{
      modeName:"测试",
      title:"测试",
      summarize:"测试",
      attribute:"测试",
      lecturerName:"测试",
    }],

  },
  onLoad: function (options) {

  },
  handleNav: function (e) {
    this.setData(
      {
        activeIndex: e.target.dataset.id,
        page: 1,
      },
    );
  },
   handleNav1: function (e) {
    this.setData(
      {
        activeLeft: e.target.dataset.id,
        page: 1,
      },
    );
  }
})