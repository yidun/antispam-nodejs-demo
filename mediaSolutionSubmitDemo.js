var utils = require('./utils')
// 产品密钥ID，产品标识
var secretId = 'your_secret_id'
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey = 'your_secret_key'
// 易盾反垃圾云服务融媒体解决方案信息提交接口地址
var apiurl = 'http://as.dun.163.com/v1/mediasolution/submit'
// 请求参数
var post_data = {
  // 1.设置公有有参数
  secretId: secretId,
  version: 'v1',
  timestamp: new Date().getTime(),
  nonce: utils.noncer(),
  // 2.设置私有参数
  dataId: 'fbfcad1c-dba1-490c-b4d111e784c2691765',
  url: 'http://xxx.xxx.com/xxxx',
  title: 'myTitle'
  // account: 'java@163.com',
  // ip: '123.115.77.137',
  // deviceId: '92B1E5AA-4C3D-4565-A8C2-86E297055088',
  // deviceType: '4',
  // callback: 'mycallback'
}
var content=[{
    type:"text",
    data:"text",
    dataId:"xxx"
},{
    type:"image",
    data:"http://xxx",
    dataId:"xxx"
},{
    type:"audio",
    data:"http://xxx",
    dataId:"xxx"
},{
    type:"video",
    data:"http://xxx",
    dataId:"xxx"
},{
    type:"audiovideo",
    data:"http://xxx",
    dataId:"xxx"
},{
    type:"file",
    data:"http://xxx",
    dataId:"xxx"
}];
post_data.content=JSON.stringify(content);
var signature = utils.genSignature(secretKey, post_data);
post_data.signature = signature;
// http请求结果
var responseCallback = function (responseData) {
  console.log(responseData)
  var data = JSON.parse(responseData);
  var code = data.code;
  var msg = data.msg;
  if (code == 200) {
    var obj = data.result;
    var dataId = obj.dataId;
    var taskId = obj.taskId;
    console.log("SUBMIT SUCCESS!taskId="+taskId+",dataId="+dataId);
  } else {
    console.log('ERROR:code=' + code + ',msg=' + msg)
  }
}
utils.sendHttpRequest(apiurl, 'POST', post_data, responseCallback);
