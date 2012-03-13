dirmr = require("dirmr");

exports.run = function(target, next) {

	var ops = target;
	
	var include = getInput(target),

	exclude     = (ops.exclude || []).map(function(filter) {
		return new RegExp("^" + filter + "$");
	});


	dirmr(include).
	filter(function(options, next) {
		for(var i = exclude.length; i--;) {
			if(exclude[i].test(options.name)) return next(false);
		}

		next();
	}).
	join(ops.output).
	complete(next);
}

exports.taskMessage = function(target) {
	return "copy " + getInput(target).join(', ') + " -> " + target.output;
}


function getInput(target) {
	return target.include instanceof Array ? target.include : [target.include];
}