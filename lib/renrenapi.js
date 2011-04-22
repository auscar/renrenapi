var crypt = require('crypto');
var http = require('http');
var https = require('https');
var qstr = require('querystring');



(function(module){
		var apiKey;
		var secret;
		var code;
		var token;

		module.RenRenClient = function( _apiKey, _secret, _code ){	
			apiKey = _apiKey;
			secret = _secret;
			code = _code;	
			this.init();
		}
		module.RenRenClient.prototype = {
			isReady : false,
			readyQ : [],
			ready : function(fn){
				if( !this.isReady ){
					this.readyQ.push( fn );	
				}else{
					fn.call( this );
				}
			},
			doReady : function(){
				this.isReady = true;
				for( var i=0; i<this.readyQ.length; i++ ){
					this.readyQ[i].call(this);
				}
			},
			init : function(){
				var This = this;
				//取token
				this.getToken(code,function(_token){
					token = _token;	
					console.log('token is ', token);	
					This.doReady();	
				});
			},
			
			getToken : function(code,fn){
				console.log('code',code);
					var client = new https.request({
					host : 'graph.renren.com',
					path : '/oauth/token?code='+ code +'&grant_type=authorization_code&client_id=84be21242e2b487eb6dc3288b4316d3e&client_secret=3a0662a10c174155bc11e48c2503ddc2&redirect_uri=http://localhost:8080/friend/',
					port : 443,
					method : 'GET'
				},function(res){
					console.log(res.statusCode);
					console.log('getToken 返回的数据是:');
					res.on( 'data',function(chunck){
						if(fn){
							var str = chunck.toString();
							var obj = JSON.parse(str);
							var strToken = obj.access_token;
							strToken = strToken.substring(strToken.indexOf('|')+1);
							fn.call(this,strToken);	
						}
					});
				});
				client.end();
			},
			accessAPI : function(method,_params,fn){
				var This = this;
				var url = 'api.renren.com';
				if( typeof _params == 'function' ){
					fn = _params;	
				}

				var params = {
					api_key : apiKey,
					call_id : new Date().getTime(),//URL encode
					format : 'JSON',
					method : method,
					session_key : token,
					v : '1.0'
				};

				//md5
				var str = '';
				var hash = crypt.createHash('MD5');
				for( p in params ){
					str +=(p+'='+params[p]);
				}
				str += secret;

				hash.update(str);
				var hashsum = hash.digest('hex');
				params.sig = hashsum;

				//编码一下
				for( p in params ){
					params[p] = encodeURIComponent(params[p]);
				}
				//send request
				var client = new http.request({
					host : url,
					path : '/restserver.do',
					port : 80,
					method : 'POST'
				},function(res){
					console.log('renrenapi('+ method +') 返回的数据是:');
					var datas = '';
					res.on( 'data',function(chunck){
						//console.log(chunck.toString());	
						datas += chunck;
					});
					res.on('end',function(){
						if(fn){
							fn.call(This,datas);	
						}
						//console.log(datas);
					});
				});

				var q = qstr.stringify(params);
				client.setHeader('Content-length',q.length);
				client.setHeader( 'Content-Type','application/x-www-form-urlencoded' );
				
				client.end(q,'utf8');
			},
			getFriends : function(fn){
				var This = this;
				var method = 'friends.getFriends';
				console.log('getting friends',token);			
				this.accessAPI(method,function(data){
					if(fn){
						fn.call(This,data);	
					}
				});
			}
		};
})(this);


this.getToken = function(code,fn){
		var client = new https.request({
			host : 'graph.renren.com',
			path : '/oauth/token?code='+ code +'&grant_type=authorization_code&client_id=84be21242e2b487eb6dc3288b4316d3e&client_secret=3a0662a10c174155bc11e48c2503ddc2&redirect_uri=http://localhost:8080/friend/',
			port : 443,
			method : 'GET'
		},function(res){
			//console.log(res.statusCode);
			console.log('getToken 返回的数据是:');
			res.on( 'data',function(chunck){
				if(fn){
					var str = chunck.toString();
					var obj = JSON.parse(str);
					var strToken = obj.access_token;
					strToken = strToken.substring(strToken.indexOf('|')+1);
					fn.call(this,strToken);	
				}
			});
		});
		client.end();

}

this.test = function(token){

		var url = 'api.renren.com';
		var secret = '3a0662a10c174155bc11e48c2503ddc2';
		var apikey = '84be21242e2b487eb6dc3288b4316d3e';
		var method = 'friends.getFriends';

		var params = {
			api_key : apikey,
			call_id : new Date().getTime(),//URL encode
			format : 'JSON',
			method : method,
			session_key : token,
			v : '1.0'
		};

		//md5
		var str = '';
		var hash = crypt.createHash('MD5');
		for( p in params ){
			str +=(p+'='+params[p]);
		}
		str += secret;
		//console.log('这些参数需要被hash');

		hash.update(str);
		var hashsum = hash.digest('hex');
		console.log('hash的结果是 ',hashsum);
		params.sig = hashsum;

		console.log(params);
		//编码一下
		for( p in params ){
			params[p] = encodeURIComponent(params[p]);
		}
		//send request
		var client = new http.request({
			host : url,
			path : '/restserver.do',
			//host : 'localhost',
			port : 80,
			method : 'POST'
		},function(res){
			console.log(res.statusCode);
			console.log('renrenapi('+ method +') 返回的数据是:');
			res.on( 'data',function(chunck){
				console.log(chunck.toString());	
			});
		});

		var q = qstr.stringify(params);
		client.setHeader('Content-length',q.length);
		client.setHeader( 'Content-Type','application/x-www-form-urlencoded' );
		
		console.log('最后，这些数据要被传输');
		console.log(q);
		client.end(q,'utf8');
		return params;
}








