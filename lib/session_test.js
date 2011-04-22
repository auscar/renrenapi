var http = require('http');
		
		//send request
		var client = new http.request({
			host : 'api.renren.com',
			path : '/restserver.do',
			port : 80,
			method : 'POST'
		},function(res){
			console.log(res.statusCode);
			console.log('renrenapi 返回的数据是:');
			res.on( 'data',function(chunck){
				console.log(chunck.toString());	
			});
		});

		var q = 'api_key%3D84be21242e2b487eb6dc3288b4316d3e%26call_id%3D1303086812008%26format%3DJSON%26method%3Dfriends.getFriends%26session_key%3D5.ba38d562deb110b3b08230d6e8ff2a37.86400.1303174800-250805736%26v%3D1.0%26sig%3D057b0db914dff9698f9859dd5e91369e';
		client.setHeader('Content-Length',q.length);
		//console.log('---------------------------------------');
		console.log('最后，这些数据要被传输');
		console.log(q);
		//client.write(q,'utf8');
		client.end(q,'utf8');
