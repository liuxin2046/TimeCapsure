// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    const res = await db.collection('follow').where({
        _openid: wxContext.OPENID
    }).get()
    // 获取关注的人的信息列表
    const {data} = res
    

    
}