dirmr = require("dirmr");

exports.run = function(target, next) {

	var ops = target;
	
	var include = ops.include instanceof Array ? ops.include : [ops.include],

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