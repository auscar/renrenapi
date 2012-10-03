var crypt = require('crypto');
var mdf = require('./md5');
var http = require('http');
var https = require('https');
var qstr = require('querystring');
var multiparter = require("multiparter");//用来上传binary的组件multipart/form-data
var logger = require('nlogger').logger(module);

function $extend (obj,addOns){
	for( p in addOns ){
		obj[p] = addOns[p];
	}
}
exports.configure = function(appKey, appSecret, callback){
	exports.appKey = appKey;
	exports.appSecret = appSecret;
	exports.callback = callback;
};

exports.User = function(access_token, open_user_id){
	this.access_token = access_token;
	this.open_user_id = open_user_id;	
};
exports.User.prototype = {
	makeSig : function(_params){
		var params = {};
		$extend(params, _params);

		//按照字典序排一下序
		var ret = [];
		for( name in params ){
			ret.push(name);	
		}
		ret.sort(function(a,b){
			if(a<b)return -1;
			else return 1;
		});

		//md5
		var str = '';
		for( var i = 0; i<ret.length ;i++ ){
			str += (ret[i]+'='+params[ret[i]]);	
		}
		//把secret拼到最后, 这个是规则
		str += exports.appSecret;
		
		logger.info('用这串东西计算sig ');
		logger.info(str);

		return mdf.md5(str);
	},
	invokeUpload : function(method, streamInfo, params, fn){	
		var host = 'api.renren.com';
		var requestRenren = new multiparter.request(http, {
			host: host,
			port: 80,
			path: '/restserver.do',
			method: "POST"
		});
		//var params = {};

		$extend(params, {
			//api_key : exports.appKey,
			//session_key : this.access_token,
			call_id : new Date().getTime()+'',//URL encode
			format : 'JSON',
			method : method,
			access_token : this.access_token,
			v : '1.0'
		});
		
		for(pname in params){
			logger.info('正在处理 ', pname);
			requestRenren.setParam(pname, params[pname]);
		}

		var sig = this.makeSig(params);

		requestRenren.setParam('sig', sig);
		
		requestRenren.addStream(
			streamInfo.uploadName,//服务器接收时的变量名
			"test.jpg",//文件名
			"image/jpeg",// mime type TODO: 别的类型呢？
			streamInfo.length,// stream 的 size
			streamInfo.stream	
		);

		logger.info('正在发送请求到'+host);
		// send request and receive response
		requestRenren.send(function(error, response) {
			if (error) {
				console.log('[renren api]', error);
				return;
			}
			var data = "";

			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				data += chunk;
			});

			response.on("end", function() {
				if(fn){
					fn.call(this, null, data)	
				}
			});

			response.on("error", function(error) {
				console.log('[renren api]', error);
				if(fn){
					fn.call({ code : 2, error : error });
				}
			});
		});
				   
	},
	accessAPI : function(method,_params,fn){
		var This = this;
		var params = {};
		var url = 'api.renren.com';
		if( typeof _params == 'function' ){
			fn = _params;	
		}else if(typeof _params == 'object'){
			$extend( params, _params);
		}
		$extend(params, {
			api_key : exports.appKey,
			call_id : new Date().getTime(),//URL encode
			format : 'JSON',
			method : method,
			//session_key : this.access_token,
			access_token : this.access_token,
			v : '1.0'
		});

		//按照字典序排一下序
		var ret = [];
		for( name in params ){
            //console.log('key',name);
			ret.push(name);	
		}
		ret.sort(function(a,b){
			if(a<b)return -1;
			else return 1;
		});

		//md5
		var str = '';
		var hash = crypt.createHash('MD5');
		var hash2 = crypt.createHash('MD5');
		for( var i = 0; i<ret.length ;i++ ){
			str += (ret[i]+'='+params[ret[i]]);	
		}

		str += exports.appSecret;

		var hashsum = mdf.md5(str);

		params.sig = hashsum;

		//send request
		var client = new http.request({
			host : url,
			path : '/restserver.do',
			port : 80,
			method : 'POST'
		},function(res){
			//console.log('renrenapi('+ method +') 返回的数据是:');
			var datas = '';
			res.on( 'data',function(chunck){
				datas += chunck;
			});
			res.on('end',function(){
				//console.log('[renren api log] response: ',datas)
				if(fn){
					fn.call(This, null, datas);	
				}
			});
		});
        client.on('error',function(err){
			if(fn){
				fn.call(This,{msg : 'http request error'}, datas);	
			}
        });

        var qq = '';
        for( var pp in params ){
            qq += (pp+'='+encodeURIComponent(params[pp])+'&');
        }
        qq = qq.substring(0,qq.length-1);

		var q = qstr.stringify(params);


		client.setHeader('Content-length',q.length);
		client.setHeader( 'Content-Type','application/x-www-form-urlencoded' );
	    	
		client.end(q);
	},
	invoke : function(method, params, fn){
		var This = this;
		if( typeof params == 'object' ){
			this.accessAPI( method, params,function(err, data){
				if(fn){fn.call(This,err,data);}
			});
		}else{//不是object的话那么第一个参数应该就是回调函数
			fn = params;
			this.accessAPI(method, function(err, data){
				if(fn){fn.call(This,err,data);}
			});
		}
	}
};
