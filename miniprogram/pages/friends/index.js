Page({
    data: {
        current: 'tab1',
        friendsList: {},
        isShow: true
    },
    onLoad() {
    },
    onShow() {
        let _this = this
        // 查询用户表获取所有用户
        wx.cloud.callFunction({
            name: 'getfriends'
        }).then(res => {
            const {result: {res: {allUsers,follow}}} = res
            let data = Object.assign({},{allUsers},{follow})
            _this.setData({
                isShow: false,
                friendsList: data
            },()=>{
                console.log('friendsList: ',_this.data.friendsList)
            })
        })
    },
    handleChange ({ detail }) {
        this.setData({
            current: detail.key
        });
    },
    friendPage(e) {
        const userId = e.currentTarget.dataset.id
        const avatarUrl = e.currentTarget.dataset.url
        const nickName = e.currentTarget.dataset.name
        const isFollow = e.currentTarget.dataset.isfollow
        console.log('22',isFollow)
        wx.navigateTo({
            url: `../friendpage/index?userId=${userId}&avatarUrl=${avatarUrl}&nickName=${nickName}&isFollow=${isFollow}`
        })
    }
})