// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 根据boxId查询胶囊
const getBox = async (id) => {
  const res = await db.collection('boxes').doc(id).get()
  return {
    res
  }
}
// 根据commentatorId查询用户信息
const getUser = async (id) => {
  const res = await db.collection('user').doc(id).get()
  const {data: {avatarUrl,nickName}} = res
  return {
    avatarUrl,
    nickName
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: 'blue-bdd889'
  })
  // 通过openId查询消息
  const res = await db.collection('message').where({
    userId: wxContext.OPENID
  }).get()
  let {data} = res
  for(let i=0;i<data.length;i++) {
    let k = data[i].boxId
    let j = data[i].commentatorId
    const res2 = await db.collection('boxes').doc(k).get()
    const res3 = await db.collection('user').doc(j).get()
    // const res2 = getBox(k)
    const {data:{topic}} = res2
    const {data:{avatarUrl,nickName}} = res3
    data[i].topic = topic
    // const res3 = getUser(j)
    data[i].avatarUrl = avatarUrl
    data[i].nickName = nickName
  }
  /* 查询私信动态
  1.找出follow的朋友
  2.根据好友的openid查询boxes
  */
  // const letters = []
  const res4 = await db.collection('follow').where({
    _openid: wxContext.OPENID
  }).get()
  let followIds = res4.data
  for (let i=0;i<followIds.length;i++) { 
    // 关注这位朋友的时间
    const followTime = followIds[i].followTime
    // 朋友创建的时光胶囊
    const friendBoxes = await db.collection('boxes').where({
      _openid: followIds[i].followId
    }).orderBy('time', 'desc').get()
    // 筛选出朋友最新的发布的主题
    const boxes = friendBoxes.data
    followIds[i].letters = boxes.filter((item)=>{
      return item.startTime > followTime
    })
    // 获取朋友最近更新的主题
    
  }
  return {
    data,
    followIds
  }


}