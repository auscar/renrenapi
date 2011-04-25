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
		var callbackUrl = 'http://localhost:8080/friend/';
		var method = 'friends.getFriends';

		var client = new RenRenClient(apikey,secret,this.params.code,callbackUrl);
		client.ready(function(){
			console.log('貌似可以开始干活了~');	
			/*
			client.getFriends(function(data){
				var ary = JSON.parse(data);		
				console.log(ary);
				console.log('拿到了'+ ary.length +'个好友的数据');
			});
			client.getUserInfo(function(data){
				var obj = JSON.parse(data);		
				console.log(obj);
			});
			client.getLoggedInUser(function(id){
				console.log('获得的用户id是',id);	
			});


			var ext = 'send'; 
			client.hasAppPermission({ext_perm:ext},function(has){
				console.log('有'+ ext +'的权限吗?',has);	
			});

			client.isAppUser(function(ret){
				console.log('是app用户么',ret);	
			});
			client.getEmoticons(function(ret){
				console.log('表情对应列表为: ',ret);	
			});

			client.getAllocation(function(ret){
				console.log('本应用的配额是: ',ret);	
			});

			client.getAppFriends(function(ret){
				console.log('你在这个应用中的好友是: ',ret);	
			});
			client.createInvitationLink(function(ret){
				console.log('你的应用的邀请链接是: ',ret);	
			});

			client.createInvitationLink(function(ret){
				console.log('你的应用的邀请链接是: ',ret);	
			});
			var invitee = '250805736';
			client.getInvitationInfo({
				//invitee_id : invitee,	
				begin_time : '2011-02-01',
				end_time : '2011-04-01'
			},function(ret){
				console.log(invitee+'的邀请信息是: ',ret);	
			});

			//貌似审核通过的用户才能真正的发送请求
			client.sendNotifications({
				to_ids : '250805736',
				notification : 'Thisisagoodapplication!'
			},function(ret){
				console.log('消息发送结果是: ',ret);	
			});
			
			var pageid = 600253126;//宫崎骏的page
			var pageid2 = 600348748;//桂纶镁的page
			client.isPageFan({
				page_id : pageid2
			},function(ret){
				console.log('我是不是'+ pageid +'的fan呢?: ',ret);	
			});

			*/

			//******************* 以下是高级API需要额外提交申请才能使用 *************
			// 具体情况参见: http://wiki.dev.renren.com/wiki/Apply_Renren_API
			//***********************************************************************
			/*	
			client.getStatus({
				page : 1,// 请求第一页状态的数据
				count : 30 //每一页的状态条数
			},function(ret){
				console.log('你的状态列表是: ',ret);	
			});

			client.getOneStatus({
				status_id : 1924654832,//状态的id, 示例的id是我最近发的一条状态的id, 不保证以后我不会删了它哦~
				//owner_id : ''// 状态所有者的id, 不指定则为当前登录的用户
			},function(ret){
				console.log('你这条状态内容是: ',ret);	
			});
			client.setStatus({
				status : '这是一条来自renrenapi.js的状态',
				//forward_id : '123',//被转发的状态id
				//forward_owner : '456'//被转发的状态的所有者的id
			},function(ret){
				console.log('状态发布的结果是 ',ret);	
			});
			client.getStatusComment({
				status_id : 123,//状态的id
				owner_id : 456//状态所有者的id
				//page : 1 ,//支持分页，指定页号，页号从1开始。缺省返回第一页数据
				//count : 20,//支持分页，指定每页记录数，缺省为每页10条记录
				//order : 0	//获取留言的排序规则，0表示升序(最旧到新)，1表示降序(最新到旧)，默认为0
			},function(ret){
				console.log('这条状态回复的回复是',ret);	
			});
			*/

			//对一条状态增加一条回复
			client.addStatusComment({
				status_id : 123,//状态的id
				owner_id : 456//状态所有者的id
				content : '这里是状态的内容'
				//rid	: '' 231231//被回复的用户的ID，如果是直接回复某条状态，此参数不用传
			},function(ret){
				console.log('添加回复的结果是 ',ret);	
			});	

			client.createAlbum({
				name : '3D肉蒲团'//相册的名字
				//location : '香港',//相册的地点
				//description : '3D情欲电影, 棒!!!组团去看吧~',//相册的描述
				//visible : 'everyone',//相册的隐私设置. owner(自己)、friends(好友)、 networks(网络)、everyone(所有人)。99(所有人),1(好友), 3(同网络人), -1(仅自己可见)
				//password : '123456'//相册的密码，支持字母，数字，符号，限16个字符
			},function(ret){
				console.log('添加相册的结果是 ',ret);	
			});

			client.getAlbums({
				uid : 121231 //相册所有者的用户ID
				//page : 1,//分页的页数，默认值为1
				//count : 10,//分页后每页的个数，默认值为10
				//aids : '12,34,56'//多个相册的ID，以逗号分隔，最多支持10个数据
			},function(ret){
				console.log('获取相册的结果是 ',ret);	
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
