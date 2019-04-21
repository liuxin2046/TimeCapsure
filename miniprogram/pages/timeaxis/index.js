const { $Toast } = require('../../components/base/index');
let id = ''
Page({
  data: {
    list: [],
    isShow: true,
    id: '',
    defaultImg: '../../static/images/default.png'
  },
  onLoad(e) {
    let _this = this
    // 获取的是当前这个匣子的id
    id = e.id
    console.log('timeaxis id: ', id)
    // 根据匣子的id来查找其下的图文列表
    wx.cloud.callFunction({
      name: 'gettimelist',
      data: {
        id
      }
    }).then(res => {
      // const { data } = res.result.data
      _this.setData({
        isShow: false,
        list: res.result.data
      })
    })
  },
  // 获取列表数据
  getList() {
    let _this = this
    // 根据匣子的id来查找其下的图文列表
    wx.cloud.callFunction({
      name: 'gettimelist',
      data: {
        id
      }
    }).then(res => {
      // const { data } = res.result.data
      _this.setData({
        isShow: false,
        list: res.result.data
      })
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()//在标题栏中显示加载
    this.getList()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading()//完成停止加载
      wx.stopPullDownRefresh()//停止下拉刷新
    }, 1500)
  },
  deleteBox() {
    wx.cloud.callFunction({
      name: 'deletebox',
      data: {
        boxId: id
      }
    }).then(res => {
      if (res.errMsg.indexOf('ok') != -1) {
        $Toast({
          content: '删除胶囊成功',
          type: 'success',
          duration: 1,
          link: 1
        })
      }
    })
  },
  toEditPage(e) {
    // 获取的是当前这条类目的id
    const tid = e.currentTarget.dataset.id
    console.log('tid: ', e)
    wx.navigateTo({
      url: `../editpage/index?id=${id}&tid=${tid}`
    })
  },
  toBuryPage(e) {
    // 获取的是当前这条类目的id
    wx.navigateTo({
      url: `../burypage/index?id=${id}`
    })
  }
})