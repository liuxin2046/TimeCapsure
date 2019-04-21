// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: 'blue-bdd889'
  })
  if (event.delete) {
    const res = await db.collection('boxType').doc(event.fileId).update({
      data: {
        topic: event.fileName
      }
    })
    return { res }
  } else {
    const a = await db.collection('boxType').where({
      _openid: wxContext.OPENID
    }).get()
    const arr = (a.data).slice(1)
    for (let i = 0; i < arr.length; i++) {
      const res = await db.collection('boxes').where({
        boxtype: arr[i]._id,
        _openid: wxContext.OPENID
      }).count()
      arr[i].count = res.total
    }
    return {
      arr
    }
  }

}