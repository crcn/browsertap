var fs = require('fs'),
path   = require('path'),
mime   = require('mime');

module.exports = function(router, params) {

	if(!params.publicDir) {
		throw new Error('Public dir not specified');
	}

	var index = params.publicDir + "/index.html";

		
	router.on({

		/**
		 */

		'pull -unfilterable -overridable /': function(req, res) {
			path.exists(index, function(exists) {

				if(!exists) return res.error(new Error('Index file does not exist'));

				res.header('mime', mime.lookup(index));

				fs.createReadStream(index, { encoding: 'utf8' }).pipe(res);
			});		
		},

		

		/**
		 */

		'pull -web /**': function(req, res) {
			router.request('/').
			query(req.query).
			sanitized(req.sanitized).
			headers(req.headers).
			tag('stream', true).
			pull(res.success(function(stream) {
				stream.dump(res);
			}));

		}
	})
}






