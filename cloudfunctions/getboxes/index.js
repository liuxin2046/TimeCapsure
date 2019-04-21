// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'blue-bdd889'
})
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 判断是何种文件类型
  // 当选择全部时 boxtype = -1
  const boxes = {now: [], sealup: [], unsealup: []}
  if (event.boxtype == -1) {
    // 正在进行的活动
    let res = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      status: -1
    }).get()
    // 已经埋藏的活动
    let res2 = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      status: 0
    }).get()
    // 已经解封的活动
    let res3 = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      status: 1
    }).get()
    boxes.now = res.data
    boxes.sealup = res2.data
    boxes.unsealup = res3.data
    console.log('boxes: ',boxes)
  } else {
    // 正在进行的活动
    let res = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      boxtype: event.boxtype,
      status: -1
    }).get()
    // 已经埋藏的活动
    let res2 = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      boxtype: event.boxtype,
      status: 0
    }).get()
    // 已经解封的活动
    let res3 = await db.collection('boxes').where({
      _openid: wxContext.OPENID,
      boxtype: event.boxtype,
      status: 1
    }).get()
    boxes.now = res.data
    boxes.sealup = res2.data
    boxes.unsealup = res3.data
  }
  // 先取出集合记录总数
  // 等待所有
  // return (await Promise.all(tasks)).reduce((acc, cur) => ({
  //   data: acc.data.concat(cur.data),
  //   errMsg: acc.errMsg,
  // }))
  return {
    boxes
  }
}