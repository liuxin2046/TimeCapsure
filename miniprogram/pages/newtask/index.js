const { $Toast } = require('../../components/base/index');
const app = getApp()
// const mapp = getApp();
const QQMapWX = require('../../utils/qqmap-wx-jssdk');
let qqmapsdk;
const db = wx.cloud.database({
  env: 'blue-bdd889'
})
Page({
  data: {
    topic: '',
    current: '隐私模式',
    category: '',
    address: '',
    visible: false,
    boxtype: '',
    boxTypeList: [],
    status: [
      {
        id: 1,
        name: '隐私模式'
      },
      {
        id: 2,
        name: '公开模式'
      },
    ],
    mode: true //隐私模式
  },
  onLoad() {
    this.setData({
      address: app.globalData.userPosition
    })
  },
  onShow() {
    this.setData({
      boxTypeList:　app.globalData.filesList
    })
    // 实例化地图
    qqmapsdk = new QQMapWX({
      key: 'OPOBZ-QPGWU-TQ7VZ-4OFHI-C4L7Z-MXFX2'
    });
  },
  // 选中当前的文件分类
  selectedType(e) {
    let { target: { dataset: { boxtype, boxtopic } } } = e
    console.log(e)
    this.setData({
      boxtype,
      category : boxtopic
    })
    this.handleClose()
  },
  getLocalCity() {
    var _this = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: res => {
            let { address } = res.result
            console.log('地理位置: ', address)
            app.globalData.userPosition = address
            _this.setData({
              address: app.globalData.userPosition
            })
          },
          fail: res => {
            console.log('wrong: ', res)
          }
        })
      }
    })

  },
  theme(e) {
    console.log(e.detail)
    let { detail } = e.detail;
    console.log('detail: ', detail)
    this.setData({
      topic: detail.value
    })
  },
  setCategory(e) {
    // 显示分类文件夹
    this.setData({
      visible: true
    })
    let { detail } = e.detail;
    this.setData({
      category: detail.value
    })
  },
  setAddress(e) {
    let { detail } = e.detail;
    this.setData({
      address: detail.value
    })
  },
  handleChange({ detail = {} }) {
    // 选择隐私模式
    if (detail.value === '隐私模式') {
      this.setData({
        mode: true
      })
      $Toast({
        content: '该模式下匣子内容隐藏'
      });
    } else {
      this.setData({
        mode: false
      })
      $Toast({
        content: '该模式下匣子内容公开'
      });
    }
    this.setData({
      current: detail.value
    });
  },
  handleClose() {
    this.setData({
      visible: false
    })
  },
  submit(e) {
    let { topic, address, boxtype, mode } = this.data
    console.log(`主题: ${topic} 地址: ${address} 分类: ${boxtype}`)
    const db = wx.cloud.database({
      env: 'blue-bdd889'
    })
    db.collection('boxes').add({
      data: {
        topic,
        startTime: db.serverDate(),
        currentLocation: address,
        boxtype,
        mode,
        // buriedPlace: "北京",
        // endTime: db.serverDate(),
        status: -1,
        // unsealingTime: new Date('2020/01/01')
      }
    }).then(res => {
      console.log(res)
      if (res.errMsg.indexOf('ok') != -1) {
        console.log('ok')
        $Toast({
          content: '创建匣子成功',
          type: 'success',
          duration: 1,
          link: 1
        })
      }
    })
  },
  reset() {
    this.setData({
      topic: '',
      current: '隐私模式',
      address: ''
    })
  }
});