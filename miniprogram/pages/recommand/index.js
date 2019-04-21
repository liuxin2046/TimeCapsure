const app = getApp()
Page({
    data: {
        title: '',
        vedioSrc: '',
        poster: '',
        movies: {},
        song: {}
    },
    onLoad() {
        this.getMovies(),
        this.getSongs()
    },
    getMovies() {
        let _this = this
        wx.cloud.callFunction({
            name: 'getmovie'
        }).then(res => {
            console.log('movies: ',res.result.data)
            const { result: { data }} = res
            const index = Math.random()*(data.length)
            console.log('data: ',data)
            _this.setData({
                movies: data[3]
            })
        })
    },
    getSongs() {
        let _this = this
        console.log('sentiment: ',app.globalData.sentiment)
        wx.cloud.callFunction({
            name: 'getsongs',
            data: {
                sentiment: app.globalData.sentiment
            }
        }).then(res => {
            const { result: { data }} = res
            const index = Math.random()*(data.length)
            console.log('song: ',data)
            const songCloud = data[0].src
            wx.cloud.getTempFileURL({
                fileList: [songCloud],
                success: res => {
                    const { fileList } = res
                    data[0].src = fileList[0].tempFileURL
                    this.setData({
                        song: data[0]
                    })
                    console.log('获取的临时路径: ', fileList[0].tempFileURL)
                },
                fail: console.error
            })
            
        })
    }
})