var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务文本在线检测接口地址 
var apiurl="https://api.aq.163.com/v3/text/check";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	// 2.设置私有参数
	dataId:"ebfcad1c-dba1-490c-b4de-e784c2691768",
	content:"易盾测试内容！",
	ip:"123.115.77.137",
	dataType:"1",
	account:"nodejs@163.com",
	deviceType:"4",
	deviceId:"92B1E5AA-4C3D-4565-A8C2-86E297055088",
	callback:"ebfcad1c-dba1-490c-b4de-e784c2691768",
	publishTime:new Date().getTime()
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
		var taskId=result.taskId;
		var action=result.action;
		var labelArray=result.labels;
		if(action==0){
			console.log("taskId="+taskId+"，文本机器检测结果：通过")
		}else if(action==1){
			console.log("taskId="+taskId+"，文本机器检测结果：嫌疑，需人工复审，分类信息如下："+JSON.stringify(labelArray))
		}else if(action==2){
			console.log("taskId="+taskId+"，文本机器检测结果：不通过，分类信息如下："+JSON.stringify(labelArray))
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);