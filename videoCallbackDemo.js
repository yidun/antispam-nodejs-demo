var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务点播离线结果获取接口地址 
var apiurl="https://as.dun.163yun.com/v3/video/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
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
	console.log(responseData)
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
				var status = obj.status;
				if(status != 0){//异常，异常码定义见官网文档
					console.log("视频异常，status="+status);
					continue;
				}
				var videoLevel=obj.level;
				var callback=obj.callback;
				if(videoLevel==0){
					console.log("正常，callback:"+callback);
				}else if(videoLevel==1 || videoLevel==2){
					var evidences=obj.evidences;
					for(var j=0;j<evidences.length;j++){ 
						var evidence=evidences[j];
						var beginTime=evidence.beginTime;
						var endTime=evidence.endTime;
						var type=evidence.type;
						var url=evidence.url;
						var labelsArray=evidence.labels;
						for(var k=0;k<labelsArray.length;k++){
							var labelObj=labelsArray[k];
							var label=labelObj.label;
							var level=labelObj.level;
							var rate=labelObj.rate;
						}
						var resultText=videoLevel==1?"不确定":"确定";
						console.log(resultText+",callback:"+callback+",证据分类："+JSON.stringify(labelsArray)+",证据信息："+JSON.stringify(evidence))						
					}
					
				}
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);