var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务音频离线结果获取接口地址
var apiurl="http://as.dun.163.com/v3/audio/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3.1",
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
	if(code==200){
		var result=data.antispam;
		if(result.length==0){
			console.log("暂时没有结果需要获取，请稍后重试！");
		}else{
			for(var i=0;i<result.length;i++){
				var obj=result[i];
				var taskId = obj.taskId;
                var asrStatus = obj.asrStatus;
                if(asrStatus==4){
                    var asrResult = obj.asrResult;
                    console.log("检测失败:taskId="+taskId+",asrResult="+asrResult);
				}else{
                    var action = obj.action;
                    var labels = obj.labels;
                    if (action === 0) {
                        console.log("通过:taskId="+taskId);
					} else if (action === 1 || action === 2) {
						for(var j=0;j<labels.length;j++){
							var labelInfo = labels[j];
							var label = labelInfo.label;
							var level = labelInfo.level;
							var details = labelInfo.details;
							var hintArr = details.hint;
							// 二级细分类
							var subLabels = labelInfo.subLabels;
						}
                        console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId);
					}
					var segments = obj.segments;
                    if (segments &&segments.length>0) {
                        for(var j=0;j<segments.length;j++){
                            var segment = segments[j];
                            var startTime = segment.startTime;
                            var endTime = segment.endTime;
                            var content = segment.content;
                            var label = segment.label;
                            var level = segment.level;
                            console.log("taskId："+taskId+"，开始时间："+startTime+"秒，结束时间："+endTime+"秒，内容："+content+"，label："+label+"，level："+level);
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