//#include beanpoll-http

var checkAgent = require('./middleware/checkAgent');

exports.plugin = function(router, params) {

	this.require('beanpoll-http');


	checkAgent(router, {
		publicDir: this.params('publicDir')
	});

	router.on({
		
		/*'collect connect/middleware': function(req, res) {
			res.end(checkAgent(router));
		}*/
	})

}