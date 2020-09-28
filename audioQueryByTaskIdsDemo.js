var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务音频离线结果获取接口地址
var apiurl="http://as.dun.163.com/v3/audio/query/task";


//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var taskIds=["64e35e85b71043ee87f0765705138fd1"];
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
		var antispamArr = data.antispam;
		if (antispamArr != undefined && antispamArr.length === 0) {
			console.log("暂时没有结果需要获取，请稍后重试！");
		} else {
			for(var i=0; i<antispamArr.length; i++){
				var obj = antispamArr[i];
				var taskId = obj.taskId;
                var asrStatus = obj.asrStatus;
                if (asrStatus === 4) {
                    var asrResult = obj.asrResult;
                    console.log("检测失败:taskId="+taskId+",asrResult="+asrResult);
				}else{
					var status = obj.status;
					if (status === 30) {
						console.log("callback taskId="+taskId+", 结果：数据不存在");
					} else {
						var action = obj.action;
						var labels = obj.labels;
						if (action === 0) {
							console.log("通过:taskId="+taskId);
						} else if (action === 1||action === 2) {
							for(var j=0;j<labels.length;j++){
								var labelInfo = labels[j];
								var label = labelInfo.label;
								var level = labelInfo.level;
								var details = labelInfo.details;
								// 二级细分类
								var subLabels = labelInfo.subLabels;
							}
							console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId);
						}
					}
				}
			}
		}

		var languageArr = data.language;
		if (languageArr != undefined && languageArr.length === 0) {
			console.log("暂无语种检测数据");
		} else {
			for (var i=0; i<languageArr.length; i++) {
				var obj = languageArr[i];
				var status = obj.status;
				var taskId = obj.taskId;
				if (status === 30) {
					console.log("callback taskId="+taskId+", 结果：数据不存在");
				} else {
					var details = obj.details;
					if (details.length > 0) {
						for (var j=0; j<details.length; j++) {
							var language = details[j];
							var type = language.type;
							var segmentsArr = language.segments;
							if (segmentsArr.length > 0) {
								for (var k=0; k<segmentsArr.length; k++) {
									var segment = segmentsArr[k];
									console.log("taskId:"+taskId+", 语种类型:"+type+", 开始时间:"+segment.startTime+"秒, 结束时间:"+segment.endTime+"秒");
								}
							}
						}
					}
				}
			}
		}

		var asrArr = data.asr;
		if (asrArr != undefined && asrArr.length === 0) {
			console.log("暂无语音翻译数据");
		} else {
			for (var i=0; i<asrArr.length; i++) {
				var obj = asrArr[i];
				var status = obj.status;
				var taskId = obj.taskId;
				if (status === 30) {
					console.log("callback taskId="+taskId+", 结果：数据不存在");
				} else {
					var details = obj.details;
					if (details.length > 0) {
						for (var j=0; j <details.length; j++) {
							var asr = details[j];
							var startTime = asr.startTime;
							var endTime = asr.endTime;
							var content = asr.content;
							console.log("taskId:"+taskId+", 文字翻译结果:"+content+", 开始时间:"+startTime+"秒, 结束时间:"+endTime+"秒");
						}
					}
				}
			}
		}
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
};
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);