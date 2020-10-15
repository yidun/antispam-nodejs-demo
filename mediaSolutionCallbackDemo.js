var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 易盾反垃圾云服务融媒体解决方案离线结果获取接口地址
var apiurl="http://as.dun.163.com/v1/mediasolution/callback/results";

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



					if (evidences.hasOwnProperty("texts")) {
						var texts=evidences.texts;
                        for (var j = 0; i < texts.size(); j++) {
                            var text = texts[j];
                            console.log("文本dataId="+text.dataId+", action="+text.action);
                        }
					} else if (evidences.hasOwnProperty("images")) {
                        var images=evidences.images;
                        for (var j = 0; i < images.size(); j++) {
                            var image = images[j];
                            console.log("图片dataId="+image.dataId+", status="+image.status+", action="+image.action);
                        }
                    } else if (evidences.hasOwnProperty("audios")) {
                        var audios=evidences.audios;
                        for (var j = 0; i < audios.size(); j++) {
                            var audio = audios[j];
                            console.log("语音dataId="+audio.dataId+", asrStatus="+audio.asrStatus+", action="+audio.action);
                        }
                    } else if (evidences.hasOwnProperty("videos")) {
                        var videos=evidences.videos;
                        for (var j = 0; i < videos.size(); j++) {
                            var video = videos[j];
                            console.log("视频dataId="+video.dataId+", status="+video.status+", action="+video.level);
                        }
                    } else if (evidences.hasOwnProperty("audiovideos")) {
                        var audiovideos=evidences.audiovideos;
                        for (var j = 0; i < audiovideos.size(); j++) {
                            var audiovideo = audiovideos[j];
                            console.log("音视频dataId="+audiovideo.dataId+", result="+audiovideo.result);
                        }
                    } else if (evidences.hasOwnProperty("files")) {
                        var files=evidences.files;
                        for (var j = 0; i < files.size(); j++) {
                            var file = files[j];
                            console.log("文档dataId="+file.dataId+", result="+file.result);
                        }
                    }
				}
			}
		}
	} else {
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);