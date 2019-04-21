const { $Message } = require('../../components/base/index');
Page({
  data: {
    categoryList: [],
    deleteItem: undefined,
    visible: false,
    visible2: false,
    visible3: false,
    isShow: true,
    fileId: '', //需要更新的文件id
    fileName: '',
    //小程序没有refs，所以只能用动态布尔值控制关闭
    actions2: [
      {
        name: '删除',
        color: '#ed3f14'
      }
    ],
    actions: [
      {
        name: '重命名',
        color: '#80848f',
        fontsize: '20',
        width: 80,
        icon: 'brush',
      },
      {
        name: '删除',
        width: 80,
        color: '#fff',
        background: '#ed3f14',
        fontsize: '20',
        icon: 'delete'
      }
    ]
  },
  onShow() {
    this.getBoxType()
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading()//在标题栏中显示加载
    this.getBoxType()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading()//完成停止加载
      wx.stopPullDownRefresh()//停止下拉刷新
    }, 1500)
  },
  // 获取文件的分类列表
  getBoxType() {
    let _this = this
    wx.cloud.callFunction({
      name: 'getboxtype'
    }).then(res => {
      const { result: { arr } } = res
      // const arr = (res.result.data).slice(1)
      console.log('文件类型: ', res)
      _this.setData({
        categoryList: arr,
        isShow: false
      })
    })
  },
  handleCancel2() {
    this.setData({
      visible2: false,
    });
  },
  handleClickItem2() {
    const _this = this
    const { deleteItem, categoryList } = this.data
    const action = [...this.data.actions2];
    action[0].loading = true;

    this.setData({
      actions2: action
    });
    const db = wx.cloud.database({
      env: 'blue-bdd889'
    })
    db.collection('boxType').doc(categoryList[deleteItem]._id).remove().then(res => {
      _this.getBoxType()
    })
    setTimeout(() => {
      action[0].loading = false;
      this.setData({
        visible2: false,
        actions2: action,
      })
    }, 1500);
  },
  actionsTap() {
    this.setData({
      visible2: true,
    });
  },
  option(e) {
    const { categoryList } = this.data
    let { currentTarget: { dataset: { id } } } = e
    this.setData({
      deleteItem: id
    })
    let { detail: { index } } = e
    if (index == 0) {
      // 重命名
      const { _id, topic } = categoryList[id]
      this.setData({
        visible3: true,
        fileId: _id,
        fileName: topic
      })
    } else {
      this.actionsTap()
    }
  },
  // 添加文件夹
  addFile() {
    this.setData({
      visible: true,
    })
  },
  // 添加成功
  created() {
    this.setData({
      visible: false
    })
    const db = wx.cloud.database({
      env: 'blue-bdd889'
    })
    let _this = this
    db.collection('boxType').add({
      data: {
        topic: _this.data.fileName
      }
    }).then(res => {
      if (res.errMsg.indexOf('ok') != -1) {
        _this.handleRemind('操作成功', 'success')
        _this.getBoxType()
      } else {
        _this.handleRemind('操作失败', 'error')
      }
    })
  },
  // 更新名称
  update() {
    this.setData({
      visible3: false
    })
    const {fileId, fileName} = this.data
    wx.cloud.callFunction({
      name: 'getboxtype',
      data:{
        fileId,
        fileName,
        delete: 1
      }
    }).then(res => {
      if (res.errMsg.indexOf('ok') != -1) {
        this.handleRemind('操作成功', 'success')
        this.getBoxType()
      } else {
        this.handleRemind('操作失败', 'error')
      }
    })
    // console.log(`id: ${fileId} topic: ${fileName}`)
  },
  // 设置新分类的名称
  setFileName(e) {
    let { detail } = e.detail;
    this.setData({
      fileName: detail.value
    })
  },
  // 更新名称
  setNewName(e) {
    let { detail } = e.detail;
    this.setData({
      fileName: detail.value
    })
  },
  // 取消操作
  throw() {
    this.setData({
      visible: false,
      visible3: false
    })
  },
  // 全局提醒
  handleRemind(content, type) {
    $Message({
      content,
      type
    });
  },
});
