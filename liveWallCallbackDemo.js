var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务直播电视墙离线结果获取接口地址
var apiurl="http://as.dun.163.com/v3/livewall/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3",
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
	if(code === 200) {
		var result = data.result;
		if (result.length === 0) {
			console.log("暂时没有结果需要获取，请稍后重试！");
		} else {
			for(var i=0; i<result.length; i++) {
				var liveResult = result[i]
				// 直播电视墙uuid
				var taskId = liveResult.taskId;
				// 数据id
				var dataId = liveResult.dataId;
				// 回调参数
				var callback = liveResult.callback;
				// 状态
				var status = liveResult.status;
				console.log("taskId:"+taskId+", dataId:"+dataId+", callback:"+callback+", status"+status);
				if (liveResult.hasOwnProperty("evidences")) {
					parseMachine(liveResult.evidences, taskId);
				} else if (liveResult.hasOwnProperty("reviewEvidences")) {
					parseHuman(liveResult.reviewEvidences, taskId)
				}
			}
		}
	}else{
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);

var parseMachine = function(evidences, taskId) {
	console.log("=== 机审信息 ===");
	var evidence = evidences.evidence;
	var labels = evidences.labels;

	// 解析 evidence
	var type = evidence.type;
	var url = evidence.url;
	var beginTime = evidence.beginTime;
	var endTime = evidence.endTime;

	// 解析 labels
	for (var i=0; i<labels.length; i++) {
		var callbackImageLabel = labels[i];
		var label = callbackImageLabel.label;
		var level = callbackImageLabel.level;
		var rate = callbackImageLabel.rate;
		var subLabels = callbackImageLabel.subLabels;
	}

	console.log("Machine Evidence: " + JSON.stringify(evidence));
	console.log("Machine Labels: " + JSON.stringify(labels));
    console.log("=================");
}

var parseHuman = function(reviewEvidences, taskId) {
	console.log("=== 人审信息 ===");
	// 操作
	var action = reviewEvidences.action;
	var actionTime = reviewEvidences.actionTime;
	var label = reviewEvidences.label;
	var detail = reviewEvidences.detail;
	var warnCount = reviewEvidences.warnCount;
	var evidence = reviewEvidences.evidence;
    if (action === 2) {
		console.log("警告,taskId:"+taskId+", 警告次数:"+warnCount+", 证据信息："+JSON.stringify(evidence));
    } else if (action === 3) {
        console.log("断流,taskId:"+taskId+", 警告次数："+warnCount+", 证据信息："+JSON.stringify(evidence));
    } else {
		console.log("人审信息："+JSON.stringify(reviewEvidences));
	}
    console.log("=================");
}