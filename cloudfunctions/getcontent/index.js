// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    // 根据当前的openId和boxId查询列表
    return await db.collection('richText').doc(event.id).get()
}