var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 易盾反垃圾云服务点播音视频解决方案离线结果获取接口地址
var apiurl="http://as.dun.163.com/v2/livewallsolution/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	// 直播音视频解决方案版本v2.1及以上语音二级细分类结构进行调整
	version:"v2.1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	console.log(responseData);
	console.log();
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
				var taskId = obj.taskId;
				var callback = obj.callback;
				var dataId = obj.dataId;
				var status = obj.status;
                console.log("taskId="+taskId+", callback="+callback+", dataId="+dataId+", status="+status);
				if (obj.hasOwnProperty("evidences")) {
					var evidences = obj.evidences;
					if (evidences.hasOwnProperty("audio")) {
						parseAudioEvidence(evidences.audio, taskId);
					} else if (evidences.hasOwnProperty("video")) {
						parseVideoEvidence(evidences.video, taskId);
					} else {
						console.log("Invalid Evidence: " + JSON.stringify(evidences));
					}
				} else if (obj.hasOwnProperty("reviewEvidences")) {
					parseHumanEvidence(obj.reviewEvidences, taskId);
				} else {
					console.log("Invalid Result: " + JSON.stringify(obj));
				}
			}
		}
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);

var parseAudioEvidence = function(audioEvidence, taskId) {
    console.log("=== 音频机审信息 ===");
    var asrStatus = audioEvidence.asrStatus;
    var startTime = audioEvidence.startTime;
    var endTime = audioEvidence.endTime;
    if (asrStatus === 4) {
        var asrResult = audioEvidence.asrResult;
        console.log("检测失败:taskId="+taskId+",asrResult="+asrResult);
    } else {
        var action = audioEvidence.action;
        var segments = audioEvidence.segments;
        var startTime = audioEvidence.startTime;
        var endTime = audioEvidence.endTime;
        if (action === 0) {
            console.log("通过:taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
        } else if (action === 1||action === 2) {
            for(var j=0; j<segments.length; j++){
                var segment = segments[j];
                var label = segment.label;
                var level = segment.level;
                // 注意二级细分类结构
                var subLabels = segment.subLabels;
                for(var k=0;k<subLabels.length;k++) {
                    var subLabelObj = subLabels[k];
                }
            }
            console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
        }
    }
    console.log("=================");
}

var parseVideoEvidence = function(evidences, taskId) {
	console.log("=== 视频机审信息 ===");
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

var parseHumanEvidence = function(humanEvidence, taskId) {
	console.log("=== 人审信息 ===");
	// 操作
	var action = humanEvidence.action;
	// 判断时间点
	var actionTime = humanEvidence.actionTime;
	// 违规类型
	var label = humanEvidence.label;
	// 违规详情
	var detail = humanEvidence.detail;
	// 警告次数
	var warnCount = humanEvidence.warnCount;
	// 证据信息
	var evidence = humanEvidence.evidence;
	
	if (action === 2) {
		// 警告
		console.log("警告, taskId:"+taskId+", 警告次数:"+warnCount+", 违规详情:"+detail+", 证据信息:"+JSON.stringify(evidence));
	} else if (action === 3) {
		// 断流
		console.log("断流, taskId:"+taskId+", 警告次数:"+warnCount+", 违规详情:"+detail+", 证据信息:"+JSON.stringify(evidence));
	} else {
		console.log("人审信息："+JSON.stringify(humanEvidence));
	}
    console.log("=================");
}
