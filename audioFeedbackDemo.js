var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务点播语音在线检测接口地址
var apiurl="http://as.dun.163.com/v1/audio/feedback";
//请求参数
var post_data = {
    // 1.设置公有有参数
    secretId:secretId,
    businessId:businessId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var feedback = {}
feedback.taskId = "4was53js2abzu52lkqfubdqg00609zfl";
feedback.level = 2
feedback.label = 200
var feedbacks = [feedback]
post_data.feedbacks = JSON.stringify(feedbacks)
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    console.log("responseData="+responseData);
    var data = JSON.parse(responseData);
    var code=data.code;
    var msg=data.msg;
    if(code==200){
        var results = data.result;
        console.log("反馈结果=" + JSON.stringify(results));
        if (results && results.length > 0) {
            for (const result of results) {
                var taskId = result.taskId
                var resultCode = result.result              
                console.log("taskId=" + taskId + " result=" + resultCode)
            }
        }
    } else {
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
