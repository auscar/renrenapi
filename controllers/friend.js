var view = require('josi/actionresults').view;
var api = require('../lib/renrenapi');
var RenRenClient = api.RenRenClient;
var crypt = require('crypto');
//var json = require('JSON');

var token;

this.index = function() {
		console.log('auth code ', this.params.code);
		//用获得的code 获取token	
		/*
		api.getToken( this.params.code, function(strToken){
			console.log('token----->>>> ',strToken);		
			//将获得的token保存起来, 以后就可以用了
			token = strToken;
			api.test(token);
			
		});
		*/

		var url = 'api.renren.com';
		var secret = '3a0662a10c174155bc11e48c2503ddc2';
		var apikey = '84be21242e2b487eb6dc3288b4316d3e';
		var method = 'friends.getFriends';

		var client = new RenRenClient(apikey,secret,this.params.code);
		client.ready(function(){
			console.log('貌似可以开始干活了~');	
			console.log('先开始获取一下好友');
			client.getFriends(function(data){
				//console.log(data);
				var ary = JSON.parse(data);		
				console.log('拿到了'+ ary.length +'个好友的数据');
			});
		});


		var params = {
			api_key : apikey,
			call_id : new Date().getTime(),//URL encode
			format : 'JSON',
			method : method,
			session_key : this.params.code,
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
		//console.log('hash的结果是 ',hashsum);
		params.sig = hashsum;
		
	params.title = 'testing';
	params.code = this.params.code;
	params.secret = secret;
	return view(params);
};

this.list = function() {
  return view({
    title: '你的所有好友是:'
  });
};
