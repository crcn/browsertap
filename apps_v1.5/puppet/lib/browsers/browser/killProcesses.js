var exec = require("child_process").exec,
async = require("async");

module.exports = function(processes, next) {
	async.forEach(processes, function(pn, next) {

		console.log('killing %s', pn);
		exec('taskkill /F /IM ' + pn, function() {
			next();
		});

	}, next);
}