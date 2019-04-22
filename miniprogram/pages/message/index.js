const { $Message } = require('../../components/base/index');
Page({
  data: {
    current: 'tab1',
    messageList: {},
    isShow: true,
    nums: 0
  },
  onLoad() {
    // let _this = this
    // 获取当前的消息列表
    wx.cloud.callFunction({
      name: 'getmessage'
    }).then(res => {
      const { result: { data, followIds } } = res
      console.log('message list: ', data)
      console.log('Private list: ', followIds)
      // Private letter 私信
      const temp = Object.assign({}, { comment: data, privateList: followIds })
      // 统计私信的数量
      let nums = this.count(followIds)
      this.setData({
        isShow: false,
        messageList: temp,
        nums
      },()=>{
        console.log('nums: ',this.data.nums)
      })
    })
  },
  count (arr) {
    let nums = 0
    for (let i=0;i<arr.length;i++) {
      for (let j=0;j<arr[i].letters.length;j++){
        nums++
      }
    }
    return nums
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