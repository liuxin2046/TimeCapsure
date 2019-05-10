Component({
  // externalClasses: ['i-class'],
  options: {
    multipleSlots: true
  },
  properties: {
      //info, success, warning, error
      src: {
          type: String,
          value: ''
      },
      userName: {
          type: String,
          value: ''
      },
      // showIcon: {
      //     type: Boolean,
      //     default: false
      // },
      // desc: {
      //     type: Boolean,
      //     default: false
      // },
  },
  data: {
      // closed: false
  },
  methods: {
      signIn() {
        console.log('okkkk')
      },
      options() {
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
          }
        })
      },
      exit() {
        console.log('exit')
      }
  }
});
