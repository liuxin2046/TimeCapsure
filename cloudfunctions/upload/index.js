// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
cloud.init()
// 上传多张图片
async function picsUpload(pics) {
    let res = []
    for (let i=0;i<pics.length;i++) {
        let picType = (pics[i].path).split('.')[1]
        res[i] = await cloud.uploadFile({
            cloudPath: 'images/'+i+'.'+picType,
            fileContent: pics[i].path
        })
    }
    return res
}
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // const fileStream = fs.createReadStream(event.path)
    // return await cloud.uploadFile({
    //     cloudPath: 'mystore.mp3',
    //     fileContent: event.path
    // })
    let record = {},pictures = {}, video = {}
    // 上传录音文件判断
    if (event.recordPath) {
        record = await cloud.uploadFile({
            cloudPath: 'r1.mp3',
            fileContent: event.recordPath
        })
    }
    // 上传图片文件文件判断
    if (event.picPath) {
        const fileContent = event.picPath
        const cloudPath = 'm'+fileContent.match(/\.[^.]+?$/)[0]
        pictures = await cloud.uploadFile({
            cloudPath,
            fileContent
        })
    }
    // 上传音频文件判断
    // let pictures = picsUpload(event.picPath)
    if (event.videoPath) {
        video = await cloud.uploadFile({
            cloudPath: 'v1.mp4',
            fileContent: event.videoPath
        })
    }
    return {
        record,
        pictures,
        video
    }
}