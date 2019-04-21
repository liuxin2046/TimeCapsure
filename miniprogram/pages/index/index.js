const {dateformat} = require('../../utils/util');
const { $Message } = require('../../components/base/index');
const QQMapWX = require('../../utils/qqmap-wx-jssdk');
// 实例化地图
const qqmapsdk = new QQMapWX({
  key: 'OPOBZ-QPGWU-TQ7VZ-4OFHI-C4L7Z-MXFX2'
})
const mapp = getApp();
const db = wx.cloud.database({
  env: 'blue-bdd889'
})
Page({
  data: {
    showLeft1: false,
    showLeft2: false,
    showRight1: false,
    showRigh2: false,
    current: 'tab1',
    visible: false,
    visible2: false,
    visible3: false,
    isShow: true,
    // presentTime: new Date().toLocaleDateString(),
    unsealingTime: '',
    currentLocation: '',
    userInfo: {},
    nickName: '匿名用户',
    avatarUrl: './user-unlogin.png',
    // address: '',
    buriedPlace: '',
    matchAddress: '',
    actions: [
      {
        name: '取消'
      },
      {
        name: '解封',
        color: '#19be6b',
        loading: false
      }
    ],
    boxTypeList: [],
    boxesList: {},
    boxtype: 0,
    boxtopic: '全部',
    openBoxId: '' //要解封的盒子的id
  },
  onLoad() {
    let _this = this;
    // 显示用户头像和昵称
    const { nickName, avatarUrl } = mapp.globalData
    this.setData({
      nickName,
      avatarUrl
    })
    // 添加上默认的文件分类
    db.collection('boxType').add({
      data: {
        _id: '-1',
        topic: '全部'
      }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.error
    })
    db.collection('boxType').add({
      data: {
        _id: '0',
        topic: '默认'
      }
    }).then(res => {
      console.log(res)
    }).catch(res => {
      console.error
    })
    // 地理授权请求
    wx.getSetting({
      success: res => {
        // 是否获取用户地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // console.log('获得了地理位置')
              _this.getLocalCity()
            },
            fail() {
              console.log('未获得地理位置')
              // _this.handleOpen2()
            }
          })
        } else {
          _this.getLocalCity()
          // console.log('获得地理位置')
        }
      }
    })
  },

  onShow() {
    this.getBoxesType()
    this.getIndexBoxes()
    // 调用云函数获取匣子列表
    // this.testFunction()
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
            // address_component:{nation: "中国", province: "浙江省", city: "杭州市", district: "西湖区", street: "浙大路", …}
            let { address, address_component: { province, city, district } } = res.result
            console.log('地理位置: ', res)
            mapp.globalData.userPosition = address
            _this.setData({
              // address: mapp.globalData.userPosition,
              // matchAddress: province + city + district
              matchAddress: '江西省宜春市宜丰县'
            })
          },
          fail: res => {
            console.log('wrong: ', res)
          }
        })
      }
    })
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()//在标题栏中显示加载
    this.getIndexBoxes()
    this.setData({
      boxtopic: '全部'
    })
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading()//完成停止加载
      wx.stopPullDownRefresh()//停止下拉刷新
    }, 1500)
  },
  getIndexBoxes() {
    // 获取首页箱子列表
    let _this = this
    wx.cloud.callFunction({
      name: 'getboxes',
      data: {
        boxtype: -1
      }
    }).then(res => {
      _this.setData({
        boxesList: res.result.boxes,
        isShow: false
      })
      // console.log('首页盒子列表: ', this.data.boxesList)
    })
  },
  toNewTask() {
    wx.navigateTo({
      url: '../newtask/index'
    })
  },
  // 调到卡片列表页面
  toTimeAxis(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../timeaxis/index?id=' + id
    })
  },
  // 打开确认解封的弹窗
  toOpenBox(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      visible3: true,
      openBoxId: id
    }, () => {
      console.log('openboxid: ', this.data.openBoxId)
      // 获取解封的条件
      wx.cloud.callFunction({
        name: 'openbox',
        data: {
          id: this.data.openBoxId
        }
      }).then(res => {
        const { result: { res: { data: { buriedPlace, unsealingTime } } } } = res
        // 告诉用户解封的时间和地点
        this.setData({
          buriedPlace,
          unsealingTime
        })
      })
    })
  },
  toggleLeft1() {
    this.setData({
      showLeft1: !this.data.showLeft1
    });
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  handleOpen() {
    this.setData({
      visible: true
    });
  },
  handleClose() {
    this.setData({
      visible: false
    });
  },
  handleOpen2() {
    // 调用授权窗口
    wx.getUserInfo
  },
  handleClose2() {
    this.setData({
      visible2: false
    });
  },
  handleClick({ detail }) {
    const _this = this
    if (detail.index === 0) {
      this.setData({
        visible3: false
      });
    } else {
      const action = [...this.data.actions];
      // const { presentTime, matchAddress } = _this.data
      // // 更新匣子status字段为1
      const { openBoxId } = this.data
      action[1].loading = true;
      this.setData({
        actions: action
      });
      //先要判断时间和日期是否符合设定的条件
      const { buriedPlace, unsealingTime, matchAddress } = this.data
      console.log('buriedPlace',buriedPlace)
      console.log('unsealingTime',unsealingTime)

      const now = new Date().getTime()
      const unsealTime = new Date(unsealingTime).getTime()
      if (_this.checkTime(unsealTime, now) && _this.checkAddress(buriedPlace, matchAddress)) {
        // console.log('ok')
        _this.openBox(openBoxId)
      } else {
        action[1].loading = false
        this.setData({
          visible3: false,
          actions: action
        })
        $Message({
          content: '解封失败！',
          type: 'error'
        })
      }
      // wx.cloud.callFunction({
      //   name: 'openbox',
      //   data: {
      //     id: openBoxId
      //   }
      // }).then(res => {
      //   console.log('isOpen: ', res)
      //   console.log('matchAddress: ', matchAddress)
      //   const { result: { res: { data: { buriedPlace, unsealingTime } } } } = res


      //   console.log('unsealingTime: ', unsealTime)
      //   console.log('presentTime: ', now)
      // })
    }
  },
  // 检查时间是否符合开启条件
  checkTime(unsealTime, now) {
    if (now >= unsealTime) {
      return true
    } else {
      return false
    }
  },
  // 检查地址是否符合开启条件
  checkAddress(buriedPlace, matchAddress) {
    console.log('matchAddress: ', matchAddress)
    if (buriedPlace.indexOf(matchAddress) != -1) {
      return true
    } else {
      return false
    }
  },
  // 胶囊解封
  openBox(openBoxId) {
    const action = [...this.data.actions];
    wx.cloud.callFunction({
      name: 'update',
      data: {
        id: openBoxId,
        status: 1
      }
    }).then(res => {
      action[1].loading = false
      this.setData({
        visible3: false,
        actions: action
      })
      $Message({
        content: '解封成功！',
        type: 'success'
      })

      this.getIndexBoxes()
      // 跳到胶囊列表页
      wx.navigateTo({
        url: '../timeaxis/index?id=' + openBoxId
      })
    })
  },
  // 打开分类的编辑页
  openEdit() {
    this.closeEdit()
    wx.navigateTo({
      url: '../categories/index'
    })
  },
  closeEdit() {
    this.setData({
      visible: false
    });
  },
  // 获取匣子的所属类别
  getBoxesType() {
    let _this = this
    wx.cloud.callFunction({
      name: 'getboxtype'
    }).then(res => {
      const { result: { arr } } = res
      // const arr = (res.result.data).slice(1)
      console.log('文件类型: ', res)
      mapp.globalData.filesList = arr
      _this.setData({
        boxTypeList: arr,
      })
    })
  },
  // 选中一个文件类型
  selectedType(e) {
    this.setData({
      isShow: true
    })
    let { target: { dataset: { boxtype, boxtopic } } } = e
    console.log('boxtype:', boxtype)
    this.setData({
      boxtype,
      boxtopic
    })
    this.handleClose()
    let _this = this
    wx.cloud.callFunction({
      name: 'getboxes',
      data: {
        boxtype
      }
    }).then(res => {
      console.log(res)
      _this.setData({
        boxesList: res.result.boxes,
        current: 'tab1',
        isShow: false
      })
    })
  }
})