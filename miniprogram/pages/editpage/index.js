var WxParse = require('../../components/wxParse/wxParse');
const { $Toast } = require('../../components/base/index');
const app = getApp()
Page({
  data: {
    recorderManager: wx.getRecorderManager(),
    innerAudioContext: wx.createInnerAudioContext(),
    poster: 'data:image/png;base64,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',
    // name: '录音1',
    author: '我的录音',
    src: '',
    lineGif: '',
    recordStatus: false,
    visible: false, //录音控件是否显示
    visible2: false, //播放录音控件是否显示
    visible3: false, //视频播放控件是否显示
    seconds: 0,
    recordPath: '',
    recordPathCloud: '', //这个是存储录音文件的fileID
    placeholderText: '',
    text: '',
    picPath: '',
    fileId: 'cloud://blue-bdd889.626c-blue-bdd889/my-image.jpg',
    videoPath: '',
    boxId: '',
    itemId: '',
    isShow: true,
    options: {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
  },
  onLoad(e) {
    let _this = this
    _this.setData({
      boxId: e.id, // 获取当前匣子的id
      itemId: e.tid //获取匣子中当前图文的tid
    }, () => {
      // 区分用户是点击添加还是图文列表
      if (_this.data.itemId) {
        // 初始化页面内容
        wx.cloud.callFunction({
          name: 'getcontent',
          data: {
            id: _this.data.itemId
          }
        }).then(res => {
          const { text, picPath, recordPathCloud, videoPath } = res.result.data
          // 将录音文件的fileID换成临时网络链接
          wx.cloud.getTempFileURL({
            fileList: [recordPathCloud],
            success: res => {
              console.log('res: ',res)
              const {fileList} = res
              _this.setData({
                visible2: recordPathCloud ? true : false,
                recordPath: fileList[0].tempFileURL,
                recordPathCloud
              },()=>{
                console.log('11: ',_this.data.recordPath)
              })
              console.log('获取的临时路径: ',fileList[0].tempFileURL)
              
            },
            fail: console.error
          })
          _this.setData({
            isShow: false,
            visible3: videoPath ? true : false,
            text,
            picPath,
            // recordPath,
            videoPath
          })
        })
      } else {
        _this.setData({
          isShow: false,
          placeholderText: '记录你此时的感受...'
        })
      }

    })
    console.log('boxId: ', this.data.boxId)
    console.log('itemId: ', this.data.itemId)
  },
  // 开始录音功能
  startRecordFunc() {
    var _this = this
    _this.setData({
      // 获取到了录音的实例后开始显示录音控件
      visible: true
    })
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: res => {
              _this.setData({
                recorderManager: wx.getRecorderManager(),
              })
            }
          })
        }
      }
    })
  },
  recordControl() {
    this.setData({
      recordStatus: !this.data.recordStatus
    })
    // 开始录音功能 recordStatus = true
    if (this.data.recordStatus) {
      console.log('start')
      // 将录音条变成彩色状态
      this.setData({
        lineGif: 'data:image/gif;base64,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'
      })
      const { recorderManager, options } = this.data
      recorderManager.start(options)
    } else {
      // 将录音条变成普通状态
      console.log('stop')
      this.setData({
        lineGif: ''
      })

    }
    // 开始计算秒数
    // this.timeControl()
  },
  // 结束录音功能
  recordEnd() {
    this.setData({
      visible: false,
      lineGif: '',
      recordStatus: false
    })
    let _this = this
    const { recorderManager } = this.data
    recorderManager.stop()
    recorderManager.onStop((res) => {
      // _this.tempFilePath = res.tempFilePath
      const recordPath = res.tempFilePath
      _this.setData({
        recordPath,
        // src: res.tempFilePath,
        visible2: true
      })
      console.log('recordPath: ', recordPath)

      const cloudPath = 'my-audio' + (new Date().getTime()) + recordPath.match(/\.[^.]+?$/)[0]
      // 上传录音文件
      wx.cloud.uploadFile({
        cloudPath,
        filePath: recordPath,
        success: res => {
          console.log('[上传文件] 成功：', res)
          const { fileID } = res
          _this.setData({
            recordPathCloud: fileID
          })
        },
      })
      console.log('停止录音: ', res.tempFilePath)
    })
  },
  photoFunc() {
    let _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        // wx.showLoading({
        //   title: '加载中',
        // })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + (new Date().getTime()) + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            const { fileID } = res
            _this.setData({
              picPath: fileID
            })
          },
          // fail: e => {
          //   console.error('[上传文件] 失败：', e)
          //   // wx.showToast({
          //   //   icon: 'none',
          //   //   title: '上传失败',
          //   // })
          // },
          // complete: () => {
          //   wx.hideLoading()
          // }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  videoFunc() {
    let _this = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        _this.setData({
          visible3: true,
          videoPath: res.tempFilePath
        })
        const videoPath = res.tempFilePath
        const cloudPath = 'my-vedio' + (new Date().getTime()) + videoPath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath: videoPath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            const { fileID } = res
            _this.setData({
              videoPath: fileID
            })
          }
        })
        console.log(res.tempFilePath)
      }
    })
  },
  speechFunc() {
    console.log(444)
  },
  // 获取文本框内容
  handleInput(e) {
    const { value } = e.detail
    // console.log(value)
    this.setData({
      text: value
    })
  },
  // 保存文件
  save() {
    $Toast({
      content: '同步中',
      type: 'loading'
    })
    let _this = this
    // 将当前的文本进行情感分析
    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8&access_token=24.78ecf8579ed0d038770c7cfdcb04386d.2592000.1558413977.282335-15820507',
      method: 'POST',
      data: {
        text: _this.data.text
      },
      success(res) {
        console.log('情绪分析: ', res.data)
        const { sentiment, positive_prob, negative_prob } = res.data.items[0]
        // 将获取到的结果发送到全局
        app.globalData.sentiment = sentiment
      }
    })
    // 将记录添加到数据库
    wx.cloud.callFunction({
      name: 'adddata',
      data: {
        aggregate: 'richText',
        itemId: _this.data.itemId,
        options: {
          recordPathCloud: _this.data.recordPathCloud,
          boxId: _this.data.boxId,
          picPath: _this.data.picPath,
          text: _this.data.text,
          videoPath: _this.data.videoPath
          // time: new Date()
        }
      }
    }).then(res => {

      // 保存成功后返回图文列表页
      wx.navigateBack({
        delta: 1
      })
      console.log('res111: ', res)
    })
    // wx.cloud.callFunction({
    //   name: 'upload',
    //   data: {
    //     recordPath: _this.data.recordPath,
    //     picPath: _this.data.picPath,
    //     videoPath: _this.data.videoPath
    //   }
    // }).then(res => {
    //   // 如果成功则获取全部的fileID,生成一条记录
    //   const { pictures } = res.result
    //   // 这里需要修改!
    //   return new Promise((resolve, reject) => {
    //     resolve(pictures)
    //   })

    // }).then(res => {
    //   // console.log('222: ',res)
    //   _this.setData({
    //     fileId: res.fileID
    //   }, () => {

    //   })

    // })
  }
  // timeControl() {
  //   let i=0
  //   let timer = setInterval(()=>{
  //     i++;
  //     this.setData({
  //       seconds: i
  //     })
  //   },1000)
  //   // 当用户点击暂停时
  //   const {seconds, recordStatus} = this.data
  //   if (seconds == 60 || !recordStatus) {
  //     console.log('暂停')
  //     clearInterval(timer)
  //   }
  // }
})