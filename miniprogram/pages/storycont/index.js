const { $Message } = require('../../components/base/index');
Page({
    data: {
        poster: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        recordPath: '',
        id: '',
        userId: '', //作者的id
        boxId: '', //主题的id
        recordPath: '',
        picPath: '',
        vedioPath: '',
        text: '',
        isShow: true,
        value: '',//留言内容
    },
    onLoad(e) {
        let _this = this
        const id = e.id
        this.setData({
            id
        })
        console.log('请求富文本的id: ', id)
        // 用id获取富文本中的内容
        wx.cloud.callFunction({
            name: 'getcontent',
            data: {
                id
            }
        }).then(res => {
            const { result: { data: { recordPathCloud, picPath, vedioPath, text, _openid, boxId } } } = res
            // 将录音文件的fileID换成临时网络链接
            wx.cloud.getTempFileURL({
                fileList: [recordPathCloud],
                success: res => {
                    const { fileList } = res
                    _this.setData({
                        recordPath: fileList[0].tempFileURL,
                        recordPathCloud
                    }, () => {
                        console.log('11: ', _this.data.recordPath)
                    })
                    console.log('获取的临时路径: ', fileList[0].tempFileURL)
                },
                fail: console.error
            })
            console.log('23333: ', res)
            _this.setData({
                isShow: false,
                recordPathCloud,
                vedioPath,
                text,
                picPath,
                userId: _openid,
                boxId
            })

        }).catch(e => {
            console.log('error: ', e)
        })
    },
    setMessage(e) {
        const { value } = e.detail
        this.setData({
            value
        })
    },
    submit() {
        // 将当前记录的id和留言内容上传
        const { id, value, userId, boxId } = this.data
        wx.cloud.callFunction({
            name: 'message',
            data: {
                id,
                value,
                userId,
                boxId
            }
        }).then(res => {
            if (res.errMsg.indexOf('ok') != -1) {
                $Message({
                    content: '评论成功',
                    type: 'success'
                });
            } else {
                $Message({
                    content: '评论失败',
                    type: 'error'
                });
            }
        })
    }
})