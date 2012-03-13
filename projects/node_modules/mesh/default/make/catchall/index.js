var catchall = require('catchall'),
fs = require('fs'),
path = require('path')


exports.run = function(target, next) {

	catchall.load(target.entry, next.success(function(wrappedSource) {

		fs.writeFile(target.entry, wrappedSource, next);

	}))
}


exports.buildMessage = function(target) {

	return "catchall " + path.basename(target.entry);
	
}
