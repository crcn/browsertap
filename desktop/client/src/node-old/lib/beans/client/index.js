var express = require('express'),
fs = require('fs');

exports.plugin = function() {
	

	var server = express.createServer();
	
	return {

		server: server,
		
		init: function() {

			server.set('view options', { layout: false });
			
			server.register('.html', {
				compile: function(str, options) {
					return function(locals)	 {
						return str;
					}		
				}
			});

			server.use('/', express.static(__dirname + '/public'));
			server.get('*', function(req, res) {
				res.render(__dirname + '/public/index.html');
			});
			server.listen(8080);
		}
	}
}