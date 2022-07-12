var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 易盾反垃圾云服务投诉举报解决方案离线结果获取接口地址
var apiurl="http://as.dun.163.com/v1/report/callback/query";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var taskIds=["esulf8ytd9l2qr3zfawhnoxg05009va2","7z72t7do7qyrq7n46tzhpxig00609v9h","dhdior2ap5i46re6oyvl2kmg05009va4"];
post_data.taskIds=JSON.stringify(taskIds);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	console.log(responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if (code === 200) {
		var result = data.result;
		if (result.length === 0) {
            console.log("暂时没有结果需要获取，请稍后重试！");
		} else {
			for (var i=0;i<result.length;i++) {
				var obj = result[i];
                var antispam = obj.antispam;
                var taskId = antispam.taskId;
                var suggestion = antispam.suggestion;
                var checkStatus = antispam.checkStatus;
                var evidences = antispam.evidences;
                var evidencesStr=evidences!=null?JSON.stringify(evidences):"";
                console.log("QUERY SUCCESS!taskId="+taskId+",建议动作="+suggestion+",检测状态="+checkStatus
                    +",机审证据信息="+evidencesStr);
			}
		}
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
