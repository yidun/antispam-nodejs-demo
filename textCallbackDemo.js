var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务文本检测结果获取接口地址
var apiurl="https://as.dun.163yun.com/v3/text/callback/results";
//请求参数
var post_data = {
	// 设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3.1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
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
		if(result.length==0){
			console.log("暂时没有人工复审结果需要获取，请稍后重试！");
		}else{
			for(var i=0;i<result.length;i++){
				var obj=result[i];
				var action=obj.action;
				var taskId=obj.taskId;
				var callback=obj.callback;
				var labels=obj.labels;
				if(action==0){// 内容确认没问题，通过
					console.log("taskId="+taskId+"，callback="+callback+"，文本人工复审结果：通过")
				}else if(action==2){// 内容非法，不通过，需删除
					console.log("taskId="+taskId+"，callback="+callback+"，文本人工复审结果：不通过，分类信息如下："+JSON.stringify(labels))
				}
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);