var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 易盾反垃圾云服务点播音视频解决方案离线结果获取接口地址
var apiurl="http://as.dun.163.com/v1/videosolution/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	// 点播音视频解决方案版本v1.1及以上语音二级细分类subLabels结构进行调整
	version:"v1.1",
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
		var result=data.result;
		if(result.length==0){
			console.log("无数据");
		}else{
			for(var i=0;i<result.length;i++){
				var obj=result[i];
                var taskId = obj.taskId;
                var result = obj.result;
                console.log("taskId="+taskId+",result="+result);
                var evidences = obj.evidences;
                if(evidences){
                    var audio = evidences.audio;
                    if(audio){
                        var asrStatus=audio.asrStatus;
                        if(asrStatus==4){
                            console.log("检测失败taskId="+taskId+",asrStatus="+asrStatus);
                        }else{
                            var action=audio.action;
                            if(action == 0){
                                console.log("结果：通过，taskId="+taskId);
                            }else if(action == 1 || action == 2){
                                var labels=audio.labels;
                                for(var k=0;k<labels.length;k++){
                                     var labelInfo=labels[k];
                                     var label = labelInfo.label;
                                     var level = labelInfo.level;
                                     // 注意二级细分类结构
                                     var subLabels = labelInfo.subLabels;
                                     for(var k=0;k<subLabels.length;k++) {
                                         var subLabelObj = subLabels[k];
                                         var subLabel = subLabelObj.subLabel;
                                         var details = subLabelObj.details;
                                         var hintArr = details.hint;
                                     }
                                }
                            }
                        }
                    }
                }
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
