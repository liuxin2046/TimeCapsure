Component({
    externalClasses: ['i-class'],
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        // small || default || large
        size: {
            type: String,
            value: 'default'
        },
        fix: {
            type: Boolean,
            value: false
        },
        fullscreen: {
            type: Boolean,
            value: false
        },
        custom: {
            type: Boolean,
            value: false
        }
    }
});
