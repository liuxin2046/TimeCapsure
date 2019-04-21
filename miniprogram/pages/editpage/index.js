var WxParse = require('../../components/wxParse/wxParse');
const { $Toast } = require('../../components/base/index');
const app = getApp()
Page({
  data: {
    recorderManager: wx.getRecorderManager(),
    innerAudioContext: wx.createInnerAudioContext(),
    poster: '../../static/images/editpage/recond_logo.png',
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
        lineGif: '../../static/images/editpage/ripple.gif'
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