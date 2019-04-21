//app.js
App({
    onLaunch: function () {

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
            })
        }

        this.globalData = {}
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })

    },
    globalData: {
        userInfo: {
            avatarUrl: './user-unlogin.png',
            nickName: '匿名'
        },
        userPosition: null,
        sentiment: 1,
        filesList: []
    }
})
