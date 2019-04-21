// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    return await db.collection('message').add({
        data: {
            userId: event.userId,
            commentatorId: wxContext.OPENID,
            recordId: event.id,
            boxId: event.boxId,
            value: event.value,
            createTime: db.serverDate()
        }
    })
}