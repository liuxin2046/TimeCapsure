// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
    env: 'blue-bdd889'
})
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    return await db.collection('user').add({
        data: {
            _id: wxContext.OPENID,
            nickName: event.nickName,
            avatarUrl: event.avatarUrl
        }
    })
}