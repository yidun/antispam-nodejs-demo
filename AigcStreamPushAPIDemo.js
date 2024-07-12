var utils = require("./utils");
//产品密钥ID，产品标识
var secretId = "your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey = "your_secret_key";
// 易盾反垃圾云服务融媒体解决方案离线结果获取接口地址
var apiurl = "https://as.dun.163.com/v1/stream/push";

 // 输入会话检测 demo
var post_data1 = {
    // 1.设置公有有参数
    secretId:secretId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
    signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256

    // 2.设置业务参数
    sessionId : "yourSessionId" + Date.now(),
    type: "2",
    dataId: "yourDataId",
    content: "当前会话输入的内容",
    publishTime: new Date().getTime().toString(),
};

// 输出会话流式检测 demo
var post_data2 = {
    // 1.设置公有有参数
    secretId:secretId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
    signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256

    // 2.设置业务参数
    sessionId : "yourSessionId" + Date.now(),
    type: "1",
    dataId: "yourDataId",
    content: "当前输出片段1",
    publishTime: new Date().getTime().toString(),
};

 // 输出会话完毕后关闭会话 demo
var post_data3 = {
    // 1.设置公有有参数
    secretId:secretId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
    signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256

    // 2.设置业务参数
    sessionId : "yourSessionId" + Date.now(),
    type: "3",
    dataId: "yourDataId",
};

var signature = utils.genSignature(secretKey, post_data1);
post_data1.signature = signature;

// http请求结果
var responseCallback = function (responseData) {
    console.log(responseData);
    var data = JSON.parse(responseData);
    var code = data.code;
    var msg = data.msg;
    if (code === 200) {
        var result = data.result;
        if (result.length === 0) {
            console.log("暂时没有结果需要获取，请稍后重试！");
        } else {
            for (let i = 0; i < result.length; i++) {
                var obj = result[i];
                var antispam = obj.antispam;
                var sessionId = obj.sessionId;
                var sessionTaskId = obj.sessionTaskId;
                console.log(`sessionTaskId=${sessionTaskId}, sessionId=${sessionId}, antispam=${antispam}`);
            }
        }
    } else {
        console.log('ERROR: code=' + code + ',msg=' + msg);
    }
}
utils.sendHttpRequest(apiurl, "POST", post_data1, responseCallback);