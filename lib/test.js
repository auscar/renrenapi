var crypt = require('crypto');
var mdf = require('./md5');

var t = 'api_key=eabd87cf0bbe486e8f7861b57d91a4eecall_id=1303907290540format=JSONmethod=status.setsession_key=6.cae42b6ffb9f1617e90587b66d6b53e4.2592000.1306501200-282078819status=renrenapi.js的状态v=1.049617b79bd00404f99240f88c8cb3e02';

var hash = crypt.createHash('sha1');

hash.update(t);

var hashsum = hash.digest('hex');
console.log( 'sig',hashsum);
console.log('sig2',mdf.md5(t));

