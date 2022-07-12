var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务文本批量在线检测接口地址
var apiurl="http://as.dun.163.com/v5/text/batch-check";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v5",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};

// 2.设置私有参数
var textArray = [];
var text1 = {};
text1.dataId = "ebfcad1c-dba1-490c-b4de-e784c2691768";
text1.content = "易盾批量检测接口！v3接口!";
textArray.push(text1);

var text2 = {};
text2.dataId = "ebfcad1c-dba1-490c-b4de-e784c2691767";
text2.content = "易盾批量检测接口！v3接口!";
textArray.push(text2);

post_data.texts = JSON.stringify(textArray);
post_data.checkLabels = "200, 500"; // 指定过检分类

var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    console.log("responseData="+responseData);
	var data = JSON.parse(responseData);
	var code = data.code;
	var msg = data.msg;
	if(code == 200){
		var resultArray = data.result;
		for (var i=0; i<resultArray.length; i++) {
			var result = resultArray[i];
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
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
