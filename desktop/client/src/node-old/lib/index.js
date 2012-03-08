//10.0.1.23

// #include ./beans

var haba = require('haba'),
beanpoll = require('beanpoll'),
loader = haba.loader(),
dnode = require('dnode');
 
loader.
params({
	bridge: {
		host: '50.19.224.69', 
		//host: '10.0.1.23', 
		port: 7911
	},
	proxy: {
		port: 8081
	}
}).
require('haba.dnode').
require(__dirname + '/beans').
init(function() {
	dnode(loader.plugin('haba.dnode')).listen(loader.plugin('client').server);
	console.log('Listening for clients');
});
