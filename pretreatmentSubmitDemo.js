var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
var businessId="your_business_id"

// 调用易盾反垃圾云服务名单批量提交接口API示例
var apiurl="http://as.dun.163.com/v2/pretreatment/add";
//请求参数
var post_data = {
    // 1.设置公有有参数
    secretId:secretId,
    businessId:businessId,
    version:"v2",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
// 2.设置私有参数
var desc = "忽略词描述"
var entities = []
entities.push("忽略1")
entities.push("忽略2")
post_data.entitys=(entities.join(","));
post_data.description=desc;
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    var data = JSON.parse(responseData);
    var code=data.code;
    var msg=data.msg;
    if(code==200){
        var result=data.result;
        var pretreatmentAddResult = result.pretreatmentAddResult;
        var entityMap = result.entityMap;
        console.log('addResult=' + pretreatmentAddResult + ", entity=" + JSON.stringify(entityMap))
    }else{
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);