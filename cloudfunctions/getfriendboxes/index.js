// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: 'blue-bdd889'
  })
  return await db.collection('boxes').where({
    _openid: event.userId,
    mode: false,
    status: -1
  }).get()
}