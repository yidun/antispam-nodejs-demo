var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务点播语音在线检测接口地址
var apiurl="http://as.dun.163.com/v1/audio/check";
//请求参数
var post_data = {
    // 1.设置公有有参数
    secretId:secretId,
    businessId:businessId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
    // 2.设置私有参数
    url:"xxx"
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    var data = JSON.parse(responseData);
    var code=data.code;
    var msg=data.msg;
    if(code==200){
        var result=data.result;
        var taskId=result.taskId;
        var status=result.status;
        if (status == 0) {
            console.log("CHECK SUCCESS!taskId="+taskId);
            // 解析反垃圾检测结果
            var antispam=result.antispam;
            if(antispam.length==0){
                console.log("无反垃圾检测结果！");
            }else{
                for(var i=0;i<antispam.length;i++){
                    var obj=antispam[i];
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
                                // 注意二级细分类结构
                                var subLabels = labelInfo.subLabels;
                                for(var k=0;k<subLabels.length;k++) {
                                    var subLabelObj = subLabels[k];
                                    var subLabel = subLabelObj.subLabel;
                                    var details = subLabelObj.details;
                                    var hintArr = details.hint;
                                }
                            }
                            console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId);
                        }
                    }
                }
            }
            // 解析语种检测结果
            var languages=result.language;
            if(languages.length==0){
                console.log("无语种检测结果！");
            }else{
                for(var i=0;i<languages.length;i++){
                    var obj=languages[i];
                    var taskId = obj.taskId;
                    var details = obj.details;
                    if (details!=null && details.length>0) {
                        for(var j=0;j<details.length;j++){
                            var language=details[j];
                            var type = language.type;
                            var segments=language.segments;
                            if(segments!=null && segments.length>0) {
                                for(var k=0;k<segments.length;k++){
                                    var segment=segments[k];
                                    console.log("taskId："+taskId+"语种类型："+type+"断句："+segment);
                                }
                            }
                        }
                    }
                }
            }
            // 解析语种检测结果
            var asrs=result.asr;
            if(asrs.length==0){
                console.log("无语音识别检测结果！");
            }else{
                for(var i=0;i<asrs.length;i++){
                    var obj=asrs[i];
                    var taskId = obj.taskId;
                    var details = obj.details;
                    if (details!=null && details.length>0) {
                        for(var j=0;j<details.length;j++){
                            var asr=details[j];
                            var content = asr.content;
                            var startTime = asr.startTime;
                            var endTime=asr.endTime;
                            console.log("taskId："+taskId+"content："+content+"startTime："+startTime+"endTime："+endTime);
                        }
                    }
                }
            }
            // 解析人声检测结果
            var voices=result.voice;
            if(voices.length==0){
                console.log("无人声检测结果！");
            }else{
                for(var i=0;i<voices.length;i++){
                    var obj=voices[i];
                    var taskId = obj.taskId;
                    var mainGender = obj.mainGender;
                    console.log("taskId："+taskId+"mainGender："+mainGender);
                }
            }
        } else if (status == 1) {
            console.log("CHECK TIMEOUT!taskId="+taskId+",status="+status);
        }
    }else{
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
