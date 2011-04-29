var view = require('josi/actionresults').view;
var api = require('../lib/renrenapi');
var conf = require( './conf' );
var RenRenClient = api.RenRenClient;
var crypt = require('crypto');
//var json = require('JSON');

var token;

this.index = function() {
		console.log('auth code ', this.params.code);

		var url = 'api.renren.com';
		var secret = conf.secret;
		var apikey = conf.apikey;
		var callbackUrl = conf.callbackUrl;

		var method = 'friends.getFriends';
		var client = new RenRenClient(apikey,secret,this.params.code,callbackUrl);

    
        

		client.ready(function(){
			console.log('貌似可以开始干活了~');	
			client.getFriends(function(data){
				console.log('web端拿到数据了');
				var ary = JSON.parse(data);		
				//console.log(ary);
				console.log('拿到了'+ ary.length +'个好友的数据');
			});
			client.getUserInfo(function(data){
				var obj = JSON.parse(data);		
				console.log('获取用户的个人信息的结果是 ',obj);
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
			*/

			/*	
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

			//对一条状态增加一条回复
			client.addStatusComment({
				status_id : 123,//状态的id
				owner_id : 456,//状态所有者的id
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
			*/
			
			/* ----------------------------------------------------
			获取可见照片的相关信息，可以根据以下参数的组合获取结果：
			(1) 相册ID和用户ID,获取相册中所有照片的信息
			(2) 照片ID和用户ID，获取指定照片的信息
			(3) 照片ID、相册ID和用户ID，获取所有指定数据
			-------------------------------------------------------*/
//			client.getPhotoInfo({
//				uid : 123456,//照片所有者的用户ID或公共主页的ID
//				aid : 123456//相册的id。aid和pids至少传递一个
//				//password : '123456',//加密相册的密码。如果相册为加密相册，传递此参数。
//				//page : 1,//页码，默认值为1，必须大于0，无上限
//				//count : 10,//每页的容量，默认值为10，必须大于0，无上限
//				//pids : '123,456,789'//照片id串，以分","割，最多20个。aid和pids至少传递一个，传递pids则无需传递page和count参数
//			},function(ret){
//				console.log('获取相册(相片)的信息的结果是 ',ret);	
//			});
//
//
//			/* ----------------------------------------------------
//			对可见照片或者相册进行评论，可使用下面的不同参数进行不同的操作
//			(1) 使用相册ID对相册的发起评论
//			(2) 使用照片ID对照片的发起评论
//			(3) 使用相册ID或者照片ID与被回复用户ID的组合表示对评论发起二级回复
//			-------------------------------------------------------*/
//			client.addPhotoComment({
//				content : '我最喜欢的就是苍井老师的作品~'//评论的内容，最多140字
//				//aid : 123,//相册的id。aid和pid至少传递一个
//				//pid : 123,//照片id。aid和pid至少传递一个
//				//rid : 123,//评论的用户id，如果想对评论中的评论进行二级回复需要传递此参数
//				//type : 0//评论的类型，是否为悄悄话，1表示悄悄话，0表示非悄悄话，默认为0
//			},function(ret){
//				console.log('评论相册(相片)的结果是 ',ret);	
//			});
//
//			/* ----------------------------------------------------
//			对可见照片或者相册进行评论，可使用下面的不同参数进行不同的操作
//			(1) 使用相册ID获取相册的评论
//			(2) 使用照片ID获取照片的评论
//			-------------------------------------------------------*/
//			client.getPhotoComments({
//				uid : 123,//照片或相册所有者的用户ID
//				aid	: 123//,相册的id。aid和pid至少传递一个
//				//pid	: 123,照片id。aid和pid至少传递一个
//				//page : 1, //支持分页，缺省值为1（第一页）
//				//count : 10//每页的数量，缺省值为10
//			},function(ret){
//				console.log('获取相册(相片)的评论的结果是 ',ret);	
//			});
//
//
//			// ---------------------------- 日志相关 ------------------------ //
//			client.addBlog({
//				title : '记一次有意义的春游活动',//日志的标题
//				content : '这真是有意义的一天啊'//日志的内容
//				//visable : 99,//日志的隐私设置，可用值有99(所有人可见)1(仅好友可见)4(需要密码)-1(仅自己可见),错传或没传,默认为99
//				//password : '123'//用户设置的密码
//			},function(ret){
//				console.log('创建日志的结果是 ',ret);	
//			});
//
//
//			client.getBlogs({
//				uid : 123 //用户的ID或公共主页的ID
//				//page : 1,//分页的页数，默认值为1
//				//count : 20//每页显示的日志的数量, 缺省值为20
//			},function(ret){
//				console.log('获取日志列表的结果是 ',ret);	
//			});
//
//			client.getBlogInfo({
//				id : 123,//日志id
//				uid : 123//日志所有者的ID或公共主页的ID
//				//comment : 30,//返回评论内容，最大值为50，默认值0
//				//password : '123'//日志的密码（当日志有密码时）
//			},function(ret){
//				console.log('获取日志详细信息的结果是 ',ret);	
//			});
//
//			client.getBlogComments({
//				id : 123,//日志id
//				uid : 123//用户的ID或公共主页的ID
//				//page : 1,//分页的页数，默认值为1
//				//count : 20,//默认值为20, 最大值为50, 每页所包含的评论数
//				//order : 0//排序方式。1：代表逆序；0：正序。默认值为0
//			},function(ret){
//				console.log('获取日志评论的结果是 ',ret);	
//			});
//
//			client.addBlogComment({
//				id : 123,//日志ID
//				content : '老湿, 不给力呀!',//评论的内容
//				uid : 123//用户的ID或公共主页的ID
//				//rid : 123,//用于二级回复，被回复的人的用户ID
//				//type : 0//是否为悄悄话，1表示悄悄话，0表示公开评论
//			},function(ret){
//				console.log('对日志评论的结果是 ',ret);	
//			});
//		
//
//			/*发布用户的个人动态信息到用户人人网主页，同时会出现在好友的新鲜事中，以当前会话的用户（session_key对应用户）身份发送。这类新鲜事可以附带图片信息。*/
//			client.publishFeed({
//				template_id : 123,//在“我的应用”（开发者）中注册的新鲜事模板组的id
//				title_data : '{a:1,b:2}',//此项为JSON对象，如果你在定义新鲜事模板的“Feed标题”时，自定义了一些变量，那么你必须在此项中为这些变量（{actor}是系统变量，不需要赋值）进行赋值。例如： Feed标题：{actor}完成了问卷{title}得分{mark} 此项值为：{"title":"语文课","mark":"90"} 此项也支持XNML语法，但目前仅支持<xn:name>和<a>标签
//				body_data : '{c:3,d:4}'//此项为JSON对象，对新鲜事模板中body的自定义变量进行赋值，规则同title_data
//				//desc : '这是描述',//用户输入的自定义内容，最多200个字符
//				//attachment : '{...}',//此项为JSON对象，此项数据最终将被显示在新鲜事的图片模块中。格式如下所示： {"src":"图片地址","href":"图片链接"} 注意：图片链接最多为1024个字符
//				//action_links : '{...}'//此项为JSON对象，此项数据将最终被显示在新鲜事动作模块中，以便用户可以通过该数据组成的链接进入您的应用或者站点。格式如下所示： {"href":"链接地址","text":"链接说明"} 注意：链接最多为1024个字符，文字16个字符
//
//			},function(ret){
//				console.log('发新鲜事的结果是 ',ret);	
//			});
//			
//			//
//			client.addBlogComment({
//				type : '10',//新鲜事的类别，多个类型以逗号分隔，type列表见:http://wiki.dev.renren.com/wiki/Type%E5%88%97%E8%A1%A8
//				//page : 1,//支持分页，指定页号，页号从1开始，默认值为1
//				//count	: 20支持分页，每一页记录数，默认值为30，最大50
//			},function(ret){
//				console.log('获取新鲜事的结果是 ',ret);	
//			});
//
//
//



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
    params.callbackUrl = callbackUrl;
    params.apikey = apikey;

    console.log('secret',secret);
    console.log('apikey',apikey);
    console.log('callbackUrl',callbackUrl);

	return view(params);
};

this.list = function() {
  return view({
    title: '你的所有好友是:'
  });
};
