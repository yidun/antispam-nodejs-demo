var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务图片检测结果获取接口地址
var apiurl="https://as.dun.163yun.com/v3/image/callback/results";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v3",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
}
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
		var code=data.code;
		var msg=data.msg;
		if(code==200){
			var result=data.result;
			if(result.length==0){
				console.log("暂时没有人工复审结果需要获取，请稍后重试！");
			}else{
				for(var i=0;i<result.length;i++){
					var obj=result[i];
					var name=obj.name;
					var taskId=obj.taskId;
					var labelsArray=obj.labels;
					console.log("taskId="+taskId+"，name="+name+"，labels：");
					var  maxLevel = -1;
	                // 产品需根据自身需求，自行解析处理，本示例只是简单判断分类级别
					for(var k=0;k<labelsArray.length;k++){
						var labelObj=labelsArray[k];
						var label=labelObj.label;
						var level=labelObj.level;
						var rate=labelObj.rate;
						console.log("lable:"+label+",level:"+level+",rate:"+rate);
						maxLevel = level > maxLevel ? level : maxLevel;
					}
				 	switch (maxLevel) {
	                        case 0:
	                            console.log("#图片人工复审结果：最高等级为\"正常\"\n");
	                            break;
	                        case 2:
	                            console.log("#图片人工复审结果：最高等级为\"确定\"\n");
	                            break;
	                        default:
	                            break;
	                }
					
				}
			}
		}else{
			 console.log('ERROR:code=' + code+',msg='+msg);
		}	
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
