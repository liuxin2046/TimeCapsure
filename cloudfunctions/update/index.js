// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    return await db.collection('boxes').doc(event.id).update({
        data: {
            status: event.status,
            buriedPlace: event.buriedPlace,
            endTime: db.serverDate(),
            unsealingTime: event.unsealingTime
        }
    })
}