var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务音频离线结果获取接口地址
var apiurl="http://as.dun.163.com/v4/audio/callback/results";

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
	console.log("responseData="+responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
        var result=data.result;
        if(result.length==0){
            console.log("暂时没有结果需要获取，请稍后重试！");
        }else{
            for(var i=0;i<result.length;i++){
                var obj=result[i];
                // 内容安全检测结果
                var antispam=obj.antispam;
                var language=obj.language;
                var asr=obj.asr;
                var voice=obj.voice;
                if (antispam!=null) {
                    if (antispam.status==3) {
                        console.log("检测失败:taskId="+antispam.taskId);
                    } else {
                        console.log("检测成功:taskId="+antispam.taskId+",建议结果="
                            +antispam.suggestion+",分类信息="+antispam.label);
                        if (antispam.suggestion == 1 || antispam.suggestion == 2) {
                            var segments = obj.segments;
                            if (segments!=null&&segments.length!=null) {
                                for(var j=0;j<segments.length;j++){
                                    //断句数组
                                    var segment=segments[j];
                                    //断句开始时间点，单位秒
                                    var startTime=segment.startTime;
                                    //断句结束时间点，单位秒
                                    var endTime=segment.endTime;
                                    //断句内容
                                    var content=segment.content;
                                    //分类详情
                                    var labels=segment.labels;
                                    console.log("检测成功:taskId="+antispam.taskId+",startTime="
                                                         +startTime+",endTime="+endTime+",content="+content);
                                }
                            }
                        }
                    }
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
    } else {
        console.log('ERROR:code=' + code+',msg='+msg);
    }
};
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
