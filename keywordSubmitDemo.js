var utils=require("./utils");
//产品密钥ID，产品标识
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配
var businessId="your_business_id";
// 调用易盾反垃圾云服务敏感词批量提交接口API示例
var apiurl="http://as.dun.163yun.com/v1/keyword/submit";
//请求参数
var post_data = {
    // 1.设置公有有参数
    secretId:secretId,
    businessId:businessId,
    version:"v1",
    timestamp:new Date().getTime(),
    nonce:utils.noncer(),
    // 2.设置私有参数
    // 100: 色情，110: 性感，200: 广告，210: 二维码，300: 暴恐，400: 违禁，500: 涉政，600: 谩骂，700: 灌水
    category:"100"

};
var keywords = "色情敏感词1, 色情敏感词2";
post_data.keywords=keywords;
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseCallback=function(responseData){
    var data = JSON.parse(responseData);
    var code=data.code;
    var msg=data.msg;
    if(code==200){
        var result=data.result;
        console.log("SUBMIT RESULT="+result);
    }else{
        console.log('ERROR:code=' + code+',msg='+msg);
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);