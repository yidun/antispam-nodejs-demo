var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";

// 易盾反垃圾云服务直播音视频信息更新接口地址
var apiurl="https://as.dun.163.com/v1/videosolution/feedback";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	version:"v1.0",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
// 2.设置私有参数
var feedback = {}
feedback.taskId = "dfravg3mvzemm6vm9m7hfj0h02009zfl"
feedback.level = 2
feedback.label = 200
var tags = ["tag1", "tag2"]
feedback.tags=tags
var feedbacks = [feedback]
post_data.feedbacks=JSON.stringify(feedbacks);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	console.log(responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if (code === 200) {
        var result = data.result;
        for (var i=0;i<result.length;i++) {
            var item=result[i];
            var taskId=item.taskId;
            var r=item.result;
            if (r==0) {
                console.log("SUCCESS, taskId="+taskId);
            } else if (r==2) {
                console.log("NOT EXISTS, taskId="+taskId);
            } else if (r==1) {
                console.log("SERVER ERROR, taskId="+taskId);
            }
        }
    } else {
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
