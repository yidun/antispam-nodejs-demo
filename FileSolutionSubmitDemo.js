var utils = require('./utils')
// 产品密钥ID，产品标识
var secretId = 'your_secret_id'
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey = 'your_secret_key'
// 易盾反垃圾云服务文档解决方案信息提交接口地址
var apiurl = 'https://as-file.dun.163yun.com/v1/file/submit'
// 请求参数
var post_data = {
  // 1.设置公有有参数
  secretId: secretId,
  version: 'v1',
  timestamp: new Date().getTime(),
  nonce: utils.noncer(),
  // 2.设置私有参数
  dataId: 'fbfcad1c-dba1-490c-b4d111e784c2691765',
  url: 'http://xxx.xxx.com/xxxx'
  // dataType: '1',
  // account: 'java@163.com',
  // ip: '123.115.77.137',
  // checkFlag: '3',
  // callback: 'mycallback',
  // publishTime: new Date().getTime()
}
var signature = utils.genSignature(secretKey, post_data)
post_data.signature = signature
// http请求结果
var responseCallback = function (responseData) {
  console.log(responseData)
  var data = JSON.parse(responseData)
  var code = data.code
  var msg = data.msg
  if (code == 200) {
    var obj = data.result
    var dataId = obj.dataId
    var taskId = obj.taskId
  } else {
    console.log('ERROR:code=' + code + ',msg=' + msg)
  }
}
utils.sendHttpRequest(apiurl, 'POST', post_data, responseCallback)
