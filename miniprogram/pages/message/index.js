const { $Message } = require('../../components/base/index');
Page({
  data: {
    current: 'tab1',
    messageList: {},
    isShow: true
  },
  onLoad() {
    let _this = this
    // 获取当前的消息列表
    wx.cloud.callFunction({
      name: 'getmessage'
    }).then(res => {
      const { result: { data, followIds } } = res
      console.log('message list: ', data)
      console.log('Private list: ', followIds)
      // Private letter 私信
      const temp = Object.assign({}, { comment: data, privateList: followIds })
      _this.setData({
        isShow: false,
        messageList: temp
      })
    })
    // wx.cloud.callFunction({
    //     name: 'getbox',
    //     data: {
    //         boxId: 'XIjz72FYXKhhnnW0'
    //     }
    // }).then(res => {
    //     console.log('test.... ',res)
    // })
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  handleDefault() {
    $Message({
      content: '前往好友列表查看'
    })
  }
})