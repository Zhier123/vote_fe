const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  try {
    
    var path = event.path
    const result = await cloud.openapi.wxacode.get({
        "path": path,
        "width": 300
      })
    return result
  } catch (err) {
    return err
  }
}   