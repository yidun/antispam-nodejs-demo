var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务文本批量在线检测接口地址 
var apiurl="http://as.dun.163.com/v3/text/batch-check";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3.1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
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
	var data = JSON.parse(responseData);
	var code = data.code;
	var msg = data.msg;
	if(code == 200){
		var resultArray = data.result;
		for (var i=0; i<resultArray.length; i++) {
			var resultItem = resultArray[i];
			var dataId = resultItem.dataId;
			var taskId = resultItem.taskId;
			var action = resultItem.action;
			var status = resultItem.status;
			console.log("dataId="+dataId+", 批量文本返回taskId:"+taskId);
			if (status == 0) {
				var labelArray = resultItem.labels;
				for (var j=0; j<labelArray.length; j++) {
					var labelItem = labelArray[j];
					var label = labelItem.label;
					var level = labelItem.level;
					var details = labelItem.details;
					var hintArray = details.hint;
					var subLabels = labelItem.subLabels;
				}
				if (action == 0) {
					console.log("taskId="+taskId+"，文本机器检测结果：通过")
				} else if (action == 1) {
					console.log("taskId="+taskId+"，文本机器检测结果：嫌疑，需人工复审，分类信息如下："+JSON.stringify(labelArray))
				} else if (action == 2) {
					console.log("taskId="+taskId+"，文本机器检测结果：不通过，分类信息如下："+JSON.stringify(labelArray))
				}
			} else if (status == 1) {
				console.log("提交失败");
			}
		}
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);