var view = require('josi/actionresults').view;
var conf = require( './conf' );

this.index = function() {
  return view({
    title: 'renrenapi - a josi app',
    controller: 'home',
    action: 'index',
    apikey : conf.apikey,
    callbackUrl : conf.callbackUrl,
    description: 'renrenapi is a <a href="http://thatismatt.github.com/josi/">josi</a> app'
  });
};
