var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 易盾反垃圾云服务网站检测结果获取接口地址
var apiurl="http://as.dun.163.com/v1/crawler/callback/results";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	version:"v1.0",
	timestamp:new Date().getTime(),
    nonce:utils.noncer(),
	signatureMethod:"MD5", // MD5, SM3, SHA1, SHA256
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;

//http请求结果
var responseCallback=function(responseData){
	console.log(responseData);
    var data = JSON.parse(responseData);
    var code = data.code;
    var msg = data.msg;
    if (code === 200) {
        var result = data.result;
        if (result === undefined || result === null || result.length === 0) {
            console.log("can't find Callback data")
        } else {
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                var dataId = obj.dataId;
                var taskId = obj.taskId;
                var result = obj.result;
                var callback = "";
                if (obj.hasOwnProperty("callback")) {
                    callback = obj.callback;
                }
                var evidencesObj = obj.evidences
                console.log("SUCCESS: dataId="+dataId+",taskId="+taskId+",result="+result+",callback="+callback+",evidences="+JSON.stringify(evidencesObj))
            }
        }
    } else {
        console.log("ERROR:code="+code+",msg="+msg)
    }
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseCallback);