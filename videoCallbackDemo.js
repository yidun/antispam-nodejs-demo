var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务点播离线结果获取接口地址
var apiurl="http://as.dun.163.com/v4/video/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v4",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
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
				var antispam=obj.antispam;
				if(antispam!=null){
				    var taskId=antispam.taskId;
				    var status=antispam.status;
				    if(status==3){
				        console.log("检测失败，taskId="+taskId);
				        continue;
				    }
				    var suggestion=antispam.suggestion;
				    var resultType=antispam.resultType;
                    var duration=antispam.duration;
                    var pictures=antispam.pictures;
                    var picturesStr=pictures!=null?JSON.stringify(pictures):"";
                    var statusStr=status==2?"成功":"失败";
                    console.log("视频检测结果：taskId="+taskId+"，检测状态："+statusStr+"，建议结果："+suggestion+"，时长："+duration+"秒，截图证据信息："+picturesStr);
				}
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
