var view = require('josi/actionresults').view;

this.index = function() {
  return view({
    title: 'sun - a josi app',
    controller: 'home',
    action: 'index',
    description: 'sun is a <a href="http://thatismatt.github.com/josi/">josi</a> app'
  });
};
