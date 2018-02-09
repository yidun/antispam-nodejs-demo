var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务直播离线结果获取接口地址 
var apiurl="https://as.dun.163yun.com/v2/livevideo/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v2.1",
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
			console.log("无数据");
		}else{
			for(var i=0;i<result.length;i++){
				var obj=result[i];
				var callback=obj.callback;
				var evidence=obj.evidence;
				var labelsArray=obj.labels;
				if(labelsArray.length==0){
					console.log("正常，callback:"+callback+",证据信息："+JSON.stringify(evidence));
				}else{
					for(var k=0;k<labelsArray.length;k++){
						var labelObj=labelsArray[k];
						var label=labelObj.label;
						var level=labelObj.level;
						var rate=labelObj.rate;
						console.log("异常，callback:"+callback+",分类："+JSON.stringify(labelObj)+",证据信息："+JSON.stringify(evidence));
					}
				}
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);