Page({
  data: {
    poster: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
    recordPath: '',
    isShow: true,
    storyList: []
  },
  onLoad(e) {
    let _this = this
    const boxId = e.boxId
    wx.cloud.callFunction({
      name: 'gettimelist',
      data: {
        id: boxId
      }
    }).then(res => {
      const {result: {data}} = res
      _this.setData({
        isShow: false,
        storyList: data
      })
      console.log('朋友胶囊里的时间列表: ',data)
    })
  },
  storyCont(e) {
    const id = e.currentTarget.dataset.id
    const userId = e.currentTarget.dataset.userId
    wx.navigateTo({
      url: `../storycont/index?id=${id}&userId=${userId}`
    })
  }
})