// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var path = event.path
    const result = await cloud.openapi.wxacode.get({
        "path": path,
        "width":240
      })
      console.log(result);
      // const upload =await cloud.uploadFile({
      //   cloudPath:event.uploadPath,
      //   fileContent:result.buffer
      // })
      return result
  } catch (err) {
    return err
  }
}