var utils=require("./utils");
//产品密钥ID，产品标识 
var secretId="your_secret_id";
// 产品私有密钥，服务端生成签名信息使用，请严格保管，避免泄露 
var secretKey="your_secret_key";
// 业务ID，易盾根据产品业务特点分配 
var businessId="your_business_id";
// 调用易盾反垃圾云服务查询直播语音片段离线结果接口API示例
var apiurl="http://as-liveaudio.dun.163yun.com/v1/liveaudio/query/task";

//请求参数
var post_data = {
	// 1.设置公有有参数
	secretId:secretId,
	businessId:businessId,
	version:"v1.0",
    taskId:"xxx",
    startTime:1578326400000,
    endTime:1578327000000,//10min limit
	timestamp:new Date().getTime(),
	nonce:utils.noncer()
};
var signature=utils.genSignature(secretKey,post_data);
post_data.signature=signature;
//http请求结果
var responseQuery=function(responseData){
	console.log(responseData);
	var data = JSON.parse(responseData);
	var code=data.code;
	var msg=data.msg;
	if(code==200){
        var result=data.result;
        if(result.length==0){
            console.log("没有结果");
        }else{
            for(var i=0;i<result.length;i++){
                var obj=result[i];
                var taskId = obj.taskId;
                var asrStatus = obj.asrStatus;
                var action = obj.action;
                var segments = obj.segments;
                var startTime = obj.startTime;
                var endTime = obj.endTime;
                if(action==0){
                    console.log("通过:taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
                }else if(action==1||action==2){
                    /*for(var j=0;j<segments.length;j++){
                        var segment=segments[j];
                        var label=segment.label;
                        var level=segment.level;
                    }*/
                    console.log("结果："+action==1?"不确定":"不通过"+"!taskId="+taskId+"开始时间:"+startTime+"结束时间:"+endTime);
                }
            }
        }
	}else{
		 console.log('ERROR:code=' + code+',msg='+msg);
	}
}
utils.sendHttpRequest(apiurl,"POST",post_data,responseQuery);