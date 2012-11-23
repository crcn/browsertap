var exec = require("child_process").exec,
async = require("async");

module.exports = function(processes, next) {
	async.forEach(processes, function(pn, next) {

		console.log('killing %s', pn);

		//need to give the app time to kill. some processes like opera (ugh >.>) stay
		//open for a bt after taskkill
		exec('taskkill /F /IM ' + pn, function() {
			next();
		});

	}, next);
}