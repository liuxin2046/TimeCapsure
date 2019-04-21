const default_data = {
    visible: false,
    content: '',
    icon: '',
    image: '',
    duration: 2,
    mask: true,
    type: 'default', // default || success || warning || error || loading
    link: null
};

let timmer = null;

Component({
    externalClasses: ['i-class'],

    data: {
        ...default_data
    },

    methods: {
        handleShow (options) {
            const { type = 'default', duration = 2, link} = options;
            console.log(options)
            this.setData({
                ...options,
                type,
                duration,
                visible: true
            });

            const d = this.data.duration * 1000;

            if (timmer) clearTimeout(timmer);
            if (d !== 0) {
                timmer = setTimeout(() => {
                    this.handleHide();
                    // 开始跳转路由
                    if (link) {
                        wx.navigateBack({
                            delta: link
                        })
                    }
                    timmer = null;
                }, d);
            }
        },

        handleHide () {
            this.setData({
                ...default_data
            });
        }
    }
});
