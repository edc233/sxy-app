const app = getApp();
Page({
  data: {
    topList: [
      {
        title: "培训",
        index: 1,
      },
      {
        title: "考试",
        index: 2,
      },
      {
        title: "任务",
        index: 3,
      },
    ],
    leftList: [
      {
        title: "未开课",
        id: 1,
      },
      {
        title: "待完成",
        id: 2,
      },
      {
        title: "已完成",
        id: 3,
      },
    ],
    topActiveIndex: 1, //顶部导航激活
    leftActive: 1, //左边导航激活
  },
  onLoad: function (options) {},
  handleTopNav: function (e) {
    const index = e.currentTarget.dataset.index;
    if (index == 1) {
      var list = [
        {
          title: "未开课",
          id: 1,
        },
        {
          title: "待完成",
          id: 2,
        },
        {
          title: "已完成",
          id: 3,
        },
      ];
    } else if (index == 2) {
      var list = [
        {
          title: "待完成",
          id: 1,
        },
        {
          title: "已完成",
          id: 2,
        },
        {
          title: "已过期",
          id: 3,
        },
      ];
    }else{
      var list = [
        {
          title:'任务',
          id:1
        }
      ]
    }
    this.setData({
      topActiveIndex: index,
      leftList: list,
      leftActive:1
    });
  },
  handLeftNav: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      leftActive: index,
    });
  },
});
