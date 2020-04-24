var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务文本数据提交接口地址
var apiurl="http://as.dun.163yun.com/v1/text/submit";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
};
var texts=[{
    dataId:"ebfcad1c-dba1-490c-b4de-e784c2691768",
    content:"易盾测试内容！v1接口!",
    action:0
}];
post_data.texts=JSON.stringify(texts);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		for(var i=0;i<result.length;i++){
			var dataId=result[i].dataId;
            var taskId=result[i].taskId;
            console.log("文本提交返回,taskId="+taskId+",dataId："+dataId)
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);