var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务直播音频离线结果获取接口地址
var apiurl="http://as.dun.163.com/v4/liveaudio/callback/results";

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
	console.log(responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if (code === 200) {
        var result = data.result;
        // 解析反垃圾检测结果
        if (result===null||result.length === 0) {
            console.log("暂时没有结果需要获取，请稍后重试！");
        } else {
            for(var i=0;i<result.length;i++){
                var antispam=result[i].antispam;
                if(antispam!=null){
                    var taskId = antispam.taskId;
                    var callback = antispam.callback;
                    var dataId = antispam.dataId;
                    var status = antispam.status;
                    var evidences = antispam.evidences;
                    var evidencesStr=evidences!=null?JSON.stringify(evidences):"";
                    var reviewEvidences = antispam.reviewEvidences;
                    var reviewEvidencesStr=reviewEvidences!=null?JSON.stringify(reviewEvidences):"";
                    console.log("直播音频：taskId:"+taskId+", callback:"+callback+", dataId:"+dataId+", 检测状态:"+status
                        +",机器证据信息="+evidencesStr+",人审证据信息="+reviewEvidencesStr);
                }
                 // 解析语音识别检测结果
                 var asr=result[i].asr;
                 if (asr!=null) {
                     var taskId = asr.taskId;
                     var content = asr.content;
                     var startTime = asr.startTime;
                     var endTime = asr.endTime;
                     console.log("语音识别结果：taskId:"+taskId+", 语音识别:"+content+", startTime:"+startTime+", endTime:"+endTime);
                 }
                 var language=result[i].language;
                 if (language!=null) {
                      var taskId = language.taskId;
                      var content = language.content;
                      var startTime = language.startTime;
                      var endTime = language.endTime;
                      console.log("语种结果：taskId:"+taskId+", 语种:"+content+", startTime:"+startTime+", endTime:"+endTime);
                  }
            }
        }
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
