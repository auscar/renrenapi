var view = require('josi/actionresults').view;

this.index = function() {
  return view({
    title: 'renrenapi - a josi app',
    controller: 'home',
    action: 'index',
    description: 'renrenapi is a <a href="http://thatismatt.github.com/josi/">josi</a> app'
  });
};
