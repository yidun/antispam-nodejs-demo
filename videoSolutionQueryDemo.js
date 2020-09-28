var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 易盾反垃圾云服务点播音视频解决方案结果查询接口地址
var apiurl="http://as.dun.163.com/v1/videosolution/query/task";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseResult=function(responseData){
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
                var status = obj.status;
                var taskId = obj.taskId;
                if(status==20){
                    console.log("非7天内数据，taskId="+taskId);
				}else if(status==30){
                    console.log("数据不存在，taskId="+taskId);
				}else if(status==0){
					var result = obj.result;
                    console.log("点播音视频结果，taskId="+taskId+"，结果="+result);
                    if (obj.hasOwnProperty("evidences")) {
                        var evidences=obj.evidences;
                        if (evidences.hasOwnProperty("text")) {
                        	var text=evidences.text;
                            console.log("文本taskId="+text.taskId+"，结果="+text.action);
                        }else if (evidences.hasOwnProperty("images")) {
                            var images=evidences.images;
                            for(var j=0;j<images.length;j++){
                                var image=images[j];
                                console.log("图片taskId="+image.taskId+"，结果="+image.labels);
							}
                        }else if (evidences.hasOwnProperty("audio")) {
                            var audio=evidences.audio;
                            console.log("语音taskId="+audio.taskId+"，检测状态="+audio.asrStatus+"，结果="+audio.action);
                        }else if (evidences.hasOwnProperty("video")) {
                            var video=evidences.video;
                            console.log("视频taskId="+video.taskId+"，检测状态="+video.status+"，结果="+video.level);
                        }
                    } else if (obj.hasOwnProperty("reviewEvidences")) {
                        var reviewEvidences=obj.reviewEvidences;
                        if (reviewEvidences.hasOwnProperty("reason")) {
                            var reason=reviewEvidences.reason;
                            console.log("人审音视频taskId"+taskId+"，原因reason="+reason);
                        }
                        if (reviewEvidences.hasOwnProperty("detail")) {
                            console.log("人审音视频taskId"+taskId+"，文本详情="+reviewEvidences.text+"图片="+reviewEvidences.image+"语音="+reviewEvidences.audio+"视频="+reviewEvidences.video);
						}
                    }
				}
			}
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseResult);