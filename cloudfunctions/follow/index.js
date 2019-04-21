// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: 'blue-bdd889'
  })

  // 查询用户
  if (event.search) {
    return await db.collection('follow').where({
      followId: event.userId
    }).get()
  } 
  else if (event.delete) {
    return await db.collection('follow').where({
      followId: event.userId
    }).remove()
  }
  else {
    return await db.collection('follow').add({
      data: {
        followId: event.followId,
        _openid: wxContext.OPENID,
        avatarUrl: event.avatarUrl,
        nickName: event.nickName,
        followTime: db.serverDate()
      }
    })
  }
}