var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务直播查询检测结果接口地址
var apiurl="http://as.dun.163yun.com/v1/livevideo/query/task";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
};
var taskIds=["ecac3bc976674c36bfc5c06445243306"];
post_data.taskIds=JSON.stringify(taskIds);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		if(result.length==0){
			console.log("无数据");
		}else{
			for(var i=0;i<result.length;i++){
				var obj=result[i];
                // 直播视频uuid
				var taskId=obj.taskId;
                // 直播状态, 101:直播中，102：直播结束
				var status=obj.status;
                // 回调标识
                var callback=obj.callback;
				// 直播检测状态(0:检测成功，10：检测中，110：请求重复，120：参数错误，130：解析错误，140：数据类型错误，150：并发超限)
                var callbackStatus=obj.callbackStatus;
				// 过期状态（20:直播不是七天内的数据，30：直播taskId不存在）
                var expireStatus=obj.expireStatus;
                console.log("RESULT，taskId="+taskId+",status="+status+",callbackStatus="+callbackStatus+",expireStatus="+expireStatus);
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
};
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);