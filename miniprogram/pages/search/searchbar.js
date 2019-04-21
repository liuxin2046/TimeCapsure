Page({
  data: {
    inputShowed: false,
    inputVal: "",
    boxesList: []
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    let _this = this
    this.setData({
      inputVal: e.detail.value
    });
    console.log(e.detail.value)
    // 实时调用searchboxes云函数
    wx.cloud.callFunction({
      name: 'searchbox',
      data: {
        value: e.detail.value || 'empty'
      }
    }).then(res => {
      const { result: { data } } = res
      _this.setData({
        boxesList: data
      })
      console.log('searchboxes: ', data)
    })
  },
  toTimeAxis(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../timeaxis/index?id=' + id
    })
  }
});