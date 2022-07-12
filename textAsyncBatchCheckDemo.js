var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务审核系统文本批量提交接口
var apiurl="http://as.dun.163.com/v5/text/async-batch-check";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v5.2",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var texts=[{
    dataId:"ebfcad1c-dba1-490c-b4de-e784c2691768",
    content:"易盾测试内容！v1接口!"
}];
post_data.texts=JSON.stringify(texts);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    console.log("responseData="+responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		var dealingCount=result.dealingCount;
		var checkTexts=result.checkTexts;
		console.log("文本提交返回,dealingCount="+dealingCount+",提交文本数据的检测信息："+JSON.stringify(checkTexts))
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
