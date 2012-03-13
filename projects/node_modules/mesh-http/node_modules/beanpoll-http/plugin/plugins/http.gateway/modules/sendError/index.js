var fs = require('fs');

module.exports = function(req, res) {
	
	res.sendError = function(errorCode, body) {
		
		res.writeHead(errorCode, {'Content-Type': 'text/plain'});
		res.end(body);

	}
}