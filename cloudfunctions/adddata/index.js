// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
    const { aggregate, options } = event
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    const wxContext = cloud.getWXContext()
    options.time = db.serverDate()
    options._openid = wxContext.OPENID
    // 判断是新建还是更新
    if (event.itemId) {
        // 执行更新操作
        return await db.collection(aggregate).doc(event.itemId).update({
            data: options
        })
    } else {
        return await db.collection(aggregate).add({
            data: options
        })
    }
}