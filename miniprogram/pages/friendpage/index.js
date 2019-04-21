const { $Message } = require('../../components/base/index');
Page({
  data: {
    userId: '',
    avatarUrl: '',
    nickName: '',
    list: [],
    isShow: true,
    isFollow: false,
    hasFollow: false
  },
  onLoad(e) {
    let _this = this
    const userId = e.userId
    const avatarUrl = e.avatarUrl
    const nickName = e.nickName
    const isFollow = e.isFollow
    console.log('33: ', userId)
    this.setData({
      userId,
      avatarUrl,
      nickName,
      isFollow: isFollow == 1 ? true : false
    }, () => {
      // 根据userId查询是否已经关注
      wx.cloud.callFunction({
        name: 'follow',
        data: {
          search: 1, //该参数用于区别是否调用查询功能
          userId
        }
      }).then(res => {
        const { result: { data } } = res
        console.log('check: ', data)
        if (data.length > 0) {
          _this.setData({
            hasFollow: true
          })
        }
      })
      // 根据userId查询动态
      wx.cloud.callFunction({
        name: 'getfriendboxes',
        data: {
          userId
        }
      }).then(res => {
        const { result: { data } } = res
        _this.setData({
          isShow: false,
          list: data
        })
        console.log('friendboxes: ', data)
      })
    })
  },
  follow() {
    const _this = this
    const { userId, avatarUrl, nickName, hasFollow } = this.data
    // 更新follow表数据
    if (hasFollow) {
      console.log('取消关注')
      wx.cloud.callFunction({
        name: 'follow',
        data: {
          delete: 1,
          userId
        }
      }).then(res => {
        const { result: { stats: { removed } } } = res
        if (removed > 0) {
          _this.handleDelete()
        }
      })
    } else {
      wx.cloud.callFunction({
        name: 'follow',
        data: {
          followId: userId,
          avatarUrl,
          nickName
        }
      }).then(res => {
        const { result: { errMsg } } = res
        if (errMsg.indexOf('ok') != -1) {
          _this.handleSuccess()
        }
      })
    }
  },
  friendbox(e) {
    const boxId = e.currentTarget.dataset.id
    // 根据这个boxId查询富文本
    console.log('boxId: ', boxId)
    wx.navigateTo({
      url: `../friendstory/index?boxId=${boxId}`
    })
  },
  handleSuccess() {
    $Message({
      content: '关注成功',
      type: 'success'
    });
  },
  handleDelete() {
    $Message({
      content: '取消关注',
      type: 'error'
    });
  },
})