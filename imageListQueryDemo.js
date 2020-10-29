var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 易盾反垃圾云服务图片名单查询接口地址
var apiurl="http://as.dun.163.com/v1/image/list/pageQuery";
//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1",
	timestamp:new Date().getTime(),
	nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
// 2.设置私有参数
post_data.pageNum=1;
post_data.pageSize=20;
post_data.startTime=1598951727666;
post_data.endTime=1598961727666;
post_data.type=0;
post_data.listType=2;
post_data.status=1;
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
		var result=data.result;
		var count=result.count;
		var rows=result.rows;
		for (var i=0;i<rows.length;i++) {
			var item=rows[i];
			var businessId=item.businessId;
			var productId=item.productId;
			var uuid=item.uuid;
			var url=item.url;
			var hitCount=item.hitCount;
			var imageLabel=item.imageLabel;
			var status=item.status;
			var listType=item.listType;
			var nosPath=item.nosPath;
		}
		console.log("count："+count+", rows："+JSON.stringify(rows));
	}else{
		console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);