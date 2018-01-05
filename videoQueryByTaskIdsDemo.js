var utils = require('./utils')
// 产品密钥ID，产品标识
var secretId = 'your_secret_id'
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey = 'your_secret_key'
// 业务ID，易盾根据产品业务特点分配
var businessId = 'your_business_id'
// 易盾反垃圾云服务点播查询接口地址
var apiurl = 'https://as.dun.163yun.com/v1/video/query/task'
// 请求参数
var post_data = {
  // 1.设置公有有参数
  secretId: secretId,
  businessId: businessId,
  version: 'v1',
  timestamp: new Date().getTime(),
  nonce: utils.noncer()
}
// 设置私有参数
var taskIds = ['3898f9e189404ea98fb20e77d11b69e3', '3f343b8947a24a6987cba8ef5ea6534f']
post_data.taskIds = JSON.stringify(taskIds)
var signature = utils.genSignature(secretKey, post_data)
post_data.signature = signature
// http请求结果
var responseCallback = function (responseData) {
  var data = JSON.parse(responseData)
  var code = data.code
  var msg = data.msg
  if (code == 200) {
    var result = data.result
    for (var i = 0; i < result.length; i++) {
      var obj = result[i]
      var status = obj.status
      if (status != 0) { // -1:提交检测失败，0:正常，10：检测中，20：不是7天内数据，30：taskId不存在，110：请求重复，120：参数错误，130：解析错误，140：数据类型错误
        console.log('获取结果异常,status=' + status)
        continue
      }
      var taskId = obj.taskId
      var callback = obj.callback
      var videoLevel = obj.level
      if (videoLevel == 0) {
        console.log('正常,callback=' + callback)
      } else if (videoLevel == 1 || videoLevel == 2) {
        var evidenceArray = obj.evidences
        for (var j = 0; j < evidenceArray.length; j++) {
          var eObject = evidenceArray[j]
          var startTime = eObject.beginTime
          var endTime = eObject.endTime
          var type = eObject.type
          var url = eObject.url
          var labelArray = eObject.labels
          for (var k = 0; k < labelArray.length; k++) {
            var lObject = labelArray[k]
            var label = lObject.label
            var level = lObject.level
            var rate = lObject.rate
          }
          var tip = videoLevel == 1 ? '不确定' : '确定'
          console.log(tip + ',callback=' + callback + ',证据信息:' + JSON.stringify(eObject) + ',证据分类:' + JSON.stringify(labelArray))
        }
      }
    }
  } else {
    console.log('ERROR:code=' + code + ',msg=' + msg)
  }
}
utils.sendHttpRequest(apiurl, 'POST', post_data, responseCallback)
