const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({
  data: {
    isShow: true
  },
  onLoad() {
    backgroundAudioManager.title = 'You Have Loved Enough'
    backgroundAudioManager.epname = 'The Future'
    backgroundAudioManager.singer = 'Leonard Cohen'
    backgroundAudioManager.coverImgUrl = 'https://y.gtimg.cn/music/photo_new/T002R300x300M00000439pEb2lhrVp.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放

    backgroundAudioManager.src = 'cloud://blue-bdd889.626c-blue-bdd889/songs/start.m4a'
  },
  linkIndex() {
    // 关闭背景音乐
    backgroundAudioManager.stop()
  },
  bindGetUserInfo(e) {
    const { nickName, avatarUrl } = e.detail.userInfo
    // 全局变量不支持多层嵌套
    app.globalData.nickName = nickName
    app.globalData.avatarUrl = avatarUrl
    // 把用户添加到用户表
    wx.cloud.callFunction({
      name: 'user',
      data: {
        nickName,
        avatarUrl
      }
    }).then(res => {
      console.log('user表: ', res)
    }).catch(res => {
      console.log('重复')
    })
    wx.redirectTo({
      url: '../index/index'
    })
  }
})