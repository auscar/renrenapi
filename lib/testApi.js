var api = require('./renrenapi');
var RenRenClient = api.RenRenClient;

var secret = '3a0662a10c174155bc11e48c2503ddc2';
var apikey = '84be21242e2b487eb6dc3288b4316d3e';


var client = new RenRenClient(apikey,secret);
client.getFriends();
