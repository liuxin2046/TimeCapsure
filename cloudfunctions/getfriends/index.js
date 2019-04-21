// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database({
        env: 'blue-bdd889'
    })
    let res = {}
    // 查询全部用户
    const allUsers = await db.collection('user').get()
    res.allUsers = allUsers.data
    // 查询关注的用户（要带openId查询）
    const follow = await db.collection('follow').where({
        _openid: wxContext.OPENID
    }).get()
    res.follow = follow.data
    return {
        res
    }
}