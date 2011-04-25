var crypt = require('crypto');
var http = require('http');
var https = require('https');
var qstr = require('querystring');

function $extend (obj,addOns){
	for( p in addOns ){
		obj[p] = addOns[p];
	}
}

(function(module){
		var apiKey;
		var secret;
		var code;
		var token;
		var callbackUrl;

		module.RenRenClient = function( _apiKey, _secret, _code, _callbackUrl ){	
			apiKey = _apiKey;
			secret = _secret;
			code = _code;	
			callbackUrl = _callbackUrl;
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
					path : '/oauth/token?code='+ code +'&grant_type=authorization_code&client_id=84be21242e2b487eb6dc3288b4316d3e&client_secret=3a0662a10c174155bc11e48c2503ddc2&redirect_uri='+callbackUrl,
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
				var params = {};
				var url = 'api.renren.com';
				if( typeof _params == 'function' ){
					fn = _params;	
				}else if(typeof _params == 'object'){
					$extend( params, _params);
				}
				$extend(params, {
					api_key : apiKey,
					call_id : new Date().getTime(),//URL encode
					//format : params.format || 'JSON',
					format : 'JSON',
					method : method,
					session_key : token,
					v : '1.0'
				});

				//按照字典序排一下序
				var ret = [];
				for( name in params ){
					ret.push(name);	
				}
				ret.sort(function(a,b){
					if(a<b)return -1;
					else return 1;
				});


				//编码一下
				for( p in params ){
					params[p] = encodeURIComponent(params[p]);
				}

				//md5
				var str = '';
				var hash = crypt.createHash('MD5');
				for( var i = 0; i<ret.length ;i++ ){
					str += (ret[i]+'='+params[ret[i]]);	
				}
				str += secret;
				hash.update(str);
				var hashsum = hash.digest('hex');
				
				params.sig = hashsum;

				
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
						datas += chunck;
					});
					res.on('end',function(){
						if(fn){
							fn.call(This,datas);	
						}
					});
				});

				var q = qstr.stringify(params);
				client.setHeader('Content-length',q.length);
				client.setHeader( 'Content-Type','application/x-www-form-urlencoded' );
				
				client.end(q,'utf8');
			},
			accessAPIWrapper : function(method,params,fn){
				var This = this;
				if( typeof params == 'object' ){
					this.accessAPI( method, params,function(data){
						if(fn){fn.call(This,data);}
					});
				}else{//不是object的话那么第一个参数应该就是回调函数
					fn = params;
					this.accessAPI( method, function(data){
						if(fn){fn.call(This,data);}
					});
				}
			},
			/* ---------------------------- APIs ----------------------------------------- */
			// --------------------------------- 管理类 ------------------------------------------ //
			getAllocation : function(params,fn){
				var method = 'admin.getAllocation';
				this.accessAPIWrapper(method,params,fn);
			},
			
			// --------------------------------- 好友类 ----------------------------------------- //
			getAppFriends : function(params,fn){
				var method = 'friends.getAppFriends';	
				this.accessAPIWrapper(method,params,fn);
			},
			getFriends : function(params,fn,idOnly){
				var This = this;
				var method = idOnly?'friends.get':'friends.getFriends';
				if( typeof params == 'object' ){
					this.accessAPI( method, params,function(data){
						if(fn){fn.call(This,data);}
					});
				}else{//不是object的话那么第一个参数应该就是回调函数
					fn = params;
					this.accessAPI( method, function(data){
						if(fn){fn.call(This,data);}
					});
				}
			},
			getUserInfo : function(params,fn){
				var This = this;
				var method = 'users.getInfo';

				if( typeof params == 'object' ){
					this.accessAPI( method, params,function(data){
						if(fn){fn.call(This,data);}
					});
				}else{//不是object的话那么第一个参数应该就是回调函数
					fn = params;
					this.accessAPI( method, function(data){
						if(fn){fn.call(This,data);}
					});
				}
			},
			getLoggedInUser : function(fn){
				var This = this;
				var method = 'users.getLoggedInUser';

				this.accessAPI( method, function(data){
					if(fn){fn.call(This,data);}
				});
			},
			hasAppPermission : function(params,fn){
				var This = this;
				var method = 'users.hasAppPermission';

				if( typeof params == 'object' ){
					this.accessAPI( method, params,function(data){
						if(fn){fn.call(This,data);}
					});
				}else{//不是object的话那么第一个参数应该就是回调函数
					fn = params;
					this.accessAPI( method, function(data){
						if(fn){fn.call( This,data );}
					});
				}
			},
			isAppUser : function(params,fn){
				var method = 'users.isAppUser';
				this.accessAPIWrapper(method,params,fn);
				
			},
			// ------------------------------------- 邀请类 -------------------------------- //
			createInvitationLink : function(params,fn){
				var method = 'invitations.createLink';
				this.accessAPIWrapper(method,params,fn);
			},
			getInvitationInfo : function(params,fn){
				var method = 'invitations.getInfo';
				this.accessAPIWrapper(method,params,fn);
			},

			//-------------------------------------- 通知类 --------------------------------- //
			sendNotifications : function(params,fn){
				var method = 'notifications.send';	
				this.accessAPIWrapper(method,params,fn);
			},

			// ------------------------------------- page类 --------------------------------- //
			isPageFan : function(params,fn){
				var method = 'pages.isFan';	
				this.accessAPIWrapper(method,params,fn);
			},	


			// ------------------------------------- 状态类 --------------------------------- //
			getEmoticons : function(params,fn){
				var method = 'status.getEmoticons';
				this.accessAPIWrapper(method,params,fn);
			},

			//******************* 以下是高级API需要额外提交申请才能使用 *************
			// 具体情况参见: http://wiki.dev.renren.com/wiki/Apply_Renren_API
			//***********************************************************************

			getStatus : function( params,fn ){
				var method = 'status.gets';
				this.accessAPIWrapper(method,params,fn);
			},
			getOneStatus : function( params, fn ){
				var method = 'status.get';
				this.accessAPIWrapper(method,params,fn);
			},
			setStatus : function( params,fn ){
				var method = 'status.set';
				this.accessAPIWrapper(method,params,fn);
			},
			getStatusComment : function(params,fn){
				var method = 'status.getComment';
				this.accessAPIWrapper(method,params,fn);
			}
			addStatusComment : function(params,fn){
				var method = 'status.addComment';
				this.accessAPIWrapper(method,params,fn);
			},

			//---------------- 相册相关 --------------------- //
			createAlbum : function(params,fn){
				var method = 'photos.createAlbum';
				this.accessAPIWrapper(method,params,fn);
			},
			getAlbums : function(params,fn){
				var method = 'photos.getAlbums';
				this.accessAPIWrapper(method,params,fn);
			}
			//upload 相片的操作比较复杂，这个版本先不做
			
			

			

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








