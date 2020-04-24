var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务直播音频离线结果获取接口地址
var apiurl="https://as-liveaudio.dun.163yun.com/v2/liveaudio/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v2",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
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
        if (result.length === 0) {
            console.log("暂时没有结果需要获取，请稍后重试！");
        } else {
            for(var i=0;i<result.length;i++){
                var obj = result[i];
                var taskId = obj.taskId;
                var callback = obj.callback;
                var dataId = obj.dataId;
                console.log("taskId:"+taskId+", callback:"+callback+", dataId:"+dataId);

                if (obj.hasOwnProperty("evidences")) {
                    parseMachine(obj.evidences, taskId);
                } else if (obj.hasOwnProperty("reviewEvidences")) {
                    parseHuman(obj.reviewEvidences, taskId);
                } else {
                    console.log("Invalid Result:" + obj)
                }
            }
        }
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);

var parseMachine = function(evidences, taskId) {
    console.log("=== 机审信息 ===");
    var asrStatus = evidences.asrStatus;
    var startTime = evidences.startTime;
    var endTime = evidences.endTime;
    if (asrStatus === 4) {
        var asrResult = evidences.asrResult;
        console.log("检测失败:taskId="+taskId+",asrResult="+asrResult);
    } else {
        var action = evidences.action;
        var segments = evidences.segments;
        var startTime = evidences.startTime;
        var endTime = evidences.endTime;
        if (action === 0) {
            console.log("通过:taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
        } else if (action === 1||action === 2) {
            for(var j=0; j<segments.length; j++){
                var segment = segments[j];
                var label = segment.label;
                var level = segment.level;
                var evidence = segment.evidence; 
            }
            console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
        }
    }
    console.log("=================");
}

var parseHuman = function(reviewEvidences, taskId) {
    console.log("=== 人审信息 ===");
    // 操作
    var action = reviewEvidences.action;
    // 操作时间点
    var actionTime = reviewEvidences.actionTime;
    // 违规类型
    var spamType = reviewEvidences.spamType;
    // 违规详情
    var spamDetail = reviewEvidences.spamDetail;
    // 警告次数
    var warnCount = reviewEvidences.warnCount;
    // 提示次数
    var promptCount = reviewEvidences.promptCount;
    // 证据信息
    var segments = reviewEvidences.segments;
    // 检测状态
    var status = reviewEvidences.status;
    var statusStr = "未知";
    if (status === 2) {
        statusStr = "检测中";
    } else if (status === 3) {
        statusStr = "检测完成";
    }

    if (action === 2) {
        // 警告
        console.log("警告, taskId:"+taskId+", 检测状态:"+statusStr+", 警告次数:"+warnCount+", 违规详情:"+spamDetail+", 证据信息:"+JSON.stringify(segments));
    } else if (action === 3) {
        console.log("断流, taskId:"+taskId+", 检测状态:"+statusStr+", 警告次数:"+warnCount+", 违规详情:"+spamDetail+", 证据信息:"+JSON.stringify(segments));
    } else if (action === 4) {
        console.log("提示, taskId:"+taskId+", 检测状态:"+statusStr+", 提示次数:"+promptCount+", 违规详情:"+spamDetail+", 证据信息:"+JSON.stringify(segments));
    } else {
        console.log("taskId:"+taskId+", 人审信息:"+JSON.stringify(reviewEvidences))
    }
    console.log("=================");
}