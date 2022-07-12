var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 易盾反垃圾云服务点播音视频解决方案离线结果获取接口地址
var apiurl="http://as.dun.163.com/v2/videosolution/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	// 点播音视频解决方案版本v1.1及以上语音二级细分类subLabels结构进行调整
	version:"v2",
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
	if(code==200){
		var result=data.result;
		if(result.length==0){
			console.log("无数据");
		}else{
			for(var i=0;i<result.length;i++){
			    var obj=result[i];
				var antispam=obj.antispam;
				var language=obj.language;
                var asr=obj.asr;
                var voice=obj.voice;
                if(antispam!=null){
                    var taskId = antispam.taskId;
                    var status = antispam.status;
                    var suggestion = antispam.suggestion;
                    var evidences = antispam.evidences;
                    var evidencesStr=evidences!=null?JSON.stringify(evidences):"";
                    var reviewEvidences = antispam.reviewEvidences;
                    var reviewEvidencesStr=reviewEvidences!=null?JSON.stringify(reviewEvidences):"";
                    console.log("点播音视频检测：taskId="+taskId+",检测状态="+status+",建议结果="+suggestion
                        +",机器证据信息="+evidencesStr+",人审证据信息="+reviewEvidencesStr);
                }
                if(language!=null){
                    var taskId=language.taskId;
                    var languageDetails=language.details;
                    if(languageDetails!=null&&languageDetails.length!=null){
                        for(var j=0;j<languageDetails.length;j++){
                            //语种数组
                            var detail=languageDetails[j];
                            //语种类型
                            var type=detail.type;
                            //断句信息
                            var segments=detail.segments;
                            console.log("语种结果:taskId="+antispam.taskId+",type="
                                                            +type+",segments="+segments);
                        }
                    }
                }
                if(asr!=null){
                    var taskId=asr.taskId;
                    var asrDetails=asr.details;
                    if(asrDetails!=null&&asrDetails.length!=null){
                        for(var j=0;j<asrDetails.length;j++){
                            //语种数组
                            var detail=asrDetails[j];
                            //断句开始时间点，单位秒
                            var startTime=detail.startTime;
                            //断句结束时间点，单位秒
                            var endTime=detail.endTime;
                            //语音识别内容
                            var content=detail.content;
                            console.log("语音识别结果:taskId="+antispam.taskId+",startTime="
                                                             +startTime+",endTime="+endTime+",content="+content);
                        }
                    }
                }
                if(voice!=null){
                    var taskId=voice.taskId;
                    var voiceDetails=voice.details;
                    if(voiceDetails!=null&&voiceDetails.length!=null){
                        for(var j=0;j<voiceDetails.length;j++){
                            //人声属性详情
                            var detail=voiceDetails[j];
                            //音频性别建议值，male/female
                            var mainGender=detail.mainGender;
                            console.log("人声属性结果:taskId="+antispam.taskId+",detail="
                                                            +detail+",mainGender="+mainGender);
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
