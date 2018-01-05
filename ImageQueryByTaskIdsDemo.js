var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务图片結果查詢接口地址
var apiurl="https://as.dun.163yun.com/v1/image/query/task";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
}
// 设置私有参数
var taskIds=["3898f9e189404ea98fb20e77d11b69e3","3f343b8947a24a6987cba8ef5ea6534f"];
post_data.taskIds=JSON.stringify(taskIds);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
		var code=data.code;
		var msg=data.msg;
		if(code==200){
			var result=data.result;
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
                            console.log("#图片查询结果：最高等级为\"正常\"\n");
                            break;
                        case 1:
	                        console.log("#图片查询结果：最高等级为\"嫌疑\"\n");
	                        break;
                        case 2:
                            console.log("#图片查询结果：最高等级为\"确定\"\n");
                            break;
                        default:
                            break;
                }
				
			}
		}else{
			 console.log('ERROR:code=' + code+',msg='+msg);
		}	
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
