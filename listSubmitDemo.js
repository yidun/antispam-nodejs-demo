var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 调用易盾反垃圾云服务名单批量提交接口API示例
var apiurl="https://as.dun.163yun.com/v2/list/submit";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
//请求参数
var post_data = {
    // 1.设置公有有参数
    secretId:secretId,
    businessId:businessId,
    version:"v2",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
    // 2.设置私有参数
    // 1: 白名单，2: 黑名单，4: 必审名单，8: 预审名单
    listType:2,
    // 1: 用户名单，2: IP名单
    entityType:1
};
var desc = "名单描述"
var entities = []
entities.push("用户黑名单1")
entities.push("用户黑名单2")
post_data.entities=JSON.stringify(entities);
post_data.description=desc;
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    var data = JSON.parse(responseData);
    var code=data.code;
    var msg=data.msg;
    if(code==200){
        var results=data.result;
        for (const result of results) {
            console.log("SUBMIT LIST ="+JSON.stringify(result));            
        }
    }else{
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);