var utils=require("./utils");

//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务直播流信息提交接口地址 
var apiurl="http://as.dun.163.com/v4/livevideo/submit";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v4",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
	// 2.设置私有参数
	dataId:"myid",
	url:"rtmp://xxx"
	// callback:"mycallback",
	// scFrequency:5
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
        var status=result.status;
        var taskId=result.taskId;
		if(status==0){
			console.log("推送成功,taskId="+taskId);
		}else{
			console.log("推送失败");
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
   
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
