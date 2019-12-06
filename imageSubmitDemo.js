var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务图片数据提交接口地址
var apiurl="https://as.dun.163yun.com/v1/image/submit";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
};
var images=[{
    name:"image1",
    data:"https://nos.netease.com/yidun/2-0-0-a6133509763d4d6eac881a58f1791976.jpg",
    level:2
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
		for(var i=0;i<result.length;i++){
			var name=result[i].name;
            var taskId=result[i].taskId;
            console.log("图片提交返回,taskId="+taskId+",name："+name)
		}
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);