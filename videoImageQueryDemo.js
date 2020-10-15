var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务直播离线结果获取接口地址 
var apiurl="http://as.dun.163.com/v1/video/query/image";

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
	taskId:"87aa24884d614ae8b8cc4d472b37be51",
	levels:"[0,1,2]",
	pageNum:"1",
	pageSize:"20",
	callbackStatus:"1",	// 详情查看官网CallbackStatus
	orderType:"3"	    // 详情查看官网LiveVideoOrderType
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result = data.result;
		var status = result.status;
		if (status == 0) {
			var images = result.images;
			var count = images.count;
			var rows = images.rows;
			for (var i=0;i<rows.length;i++) {
				var row = rows[i];
				var url = row.url;
				var label = row.label;
				var labelLevel = row.labelLabel;
				var callbackStatus = row.callbackStatus;
				var beginTime = row.beginTime;
				var endTime = row.endTIme;
				console.log("成功, count="+count+",url="+url+",label="+label+",labelLevel="+labelLevel+",callbackStatus="+callbackStatus+",开始时间="+beginTime+",结束时间="+endTime)
			}
		} else if (status == 20) {
			console.log("taskId不是7天内数据");
		} else if (status == 30) {
			console.log("taskId不存在");
		}
	}else{
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);