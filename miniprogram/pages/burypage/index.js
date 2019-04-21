const app = getApp()
const { $Toast } = require('../../components/base/index')
Page({
    data: {
        id: '',
        date: (new Date().toLocaleDateString()).replace(/\//g, '-'),
        region: ['广东省', '广州市', '海珠区'],
        customItem: '全部'
    },
    onLoad(e) {
        console.log('userposition: ', app.globalData.userPosition)
        this.setData({
            id: e.id
        }, () => {
            console.log('111 ', this.data.id)
        })
    },
    bindDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value
        })
    },
    bindRegionChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            region: e.detail.value
        })
    },
    handleBury() {
        $Toast({
            content: '封存中',
            type: 'loading'
        })
        // 获取到表单数据后开始调用云函数
        const { date, region, id } = this.data
        wx.cloud.callFunction({
            name: 'update',
            data: {
                id,
                unsealingTime: new Date(date).getTime(),
                status: 0,
                buriedPlace: region.join('')
            }
        }).then(res => {
            // 返回首页
            wx.navigateBack({
                delta: 2
            })
        })
    }
})