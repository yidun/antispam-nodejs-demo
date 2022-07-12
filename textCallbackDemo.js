var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务文本检测结果获取接口地址
var apiurl="http://as.dun.163.com/v5/text/callback/results";
//请求参数
var post_data = {
	// 设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v5",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
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
				var result=result[i];
				var antispam=result.antispam;
                var taskId=antispam.taskId;
                var suggestion=antispam.suggestion;
                var labelArray=antispam.labels;
                if(suggestion==0){
                    console.log("taskId="+taskId+"，文本机器检测结果：通过")
                }else if(suggestion==1){
                    console.log("taskId="+taskId+"，文本机器检测结果：嫌疑，需人工复审，分类信息如下："+JSON.stringify(labelArray))
                }else if(suggestion==2){
                    console.log("taskId="+taskId+"，文本机器检测结果：不通过，分类信息如下："+JSON.stringify(labelArray))
                }
                var emotionAnalysis=result.emotionAnalysis;
                var emotionAnalysisStr=emotionAnalysis!=null?JSON.stringify(emotionAnalysis):"";
                var anticheat=result.anticheat;
                var anticheatStr=anticheat!=null?JSON.stringify(anticheat):"";
                var userRisk=result.userRisk;
                var userRiskStr=userRisk!=null?JSON.stringify(userRisk):"";
                var language=result.language;
                var languageStr=language!=null?JSON.stringify(language):"";
                console.log("taskId="+taskId+"，文本机器检测结果：通过"+"，情感分析检测结果："+emotionAnalysisStr
                    +"，反作弊检测结果："+anticheatStr+"，用户画像检测结果："+userRiskStr+"，语种检测结果："+languageStr)
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
