﻿var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 易盾反垃圾云服务图片在线检测接口地址，建议离线提交30秒后进行查询，最长不能超过4小时，否则数据将会丢失
var apiurl="http://as.dun.163.com/v5/image/asyncCheck";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v5",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
	// 2.1设置私有参数
	// account:"nodejs@163.com",
	// ip:"123.115.77.137"
};
// 2.2请求图片参数
var images=[{
		name:"http://nos.netease.com/yidun/2-0-0-a6133509763d4d6eac881a58f1791976.jpg",
		type:1,
		data:"http://nos.netease.com/yidun/2-0-0-a6133509763d4d6eac881a58f1791976.jpg"
	}];
post_data.images=JSON.stringify(images);
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		var dealingCount=result.dealingCount;
		var checkImages=result.checkImages;
        var checkImagesStr=checkImages!=null?JSON.stringify(checkImages):"";
		console.log("dealingCount="+dealingCount+", checkImagesStr="+checkImagesStr);
	}else{
		console.log('ERROR:code=' + code+',msg='+msg);
	}

}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);
