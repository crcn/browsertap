var walkr = require("walkr"),
fs        = require("fs"),
seq       = require("seq");

exports.run = function(target, nextBuilder) {


	var ops = target,
	include = getInput(target),
	output  = ops.output,
	ws      = fs.createWriteStream(output),
	search  = new RegExp(target.search || "\\w+\\.\\w+$");

	
	seq(include).
	seqEach(function(file) {
			
		var nextCat = this;

		walkr(file).
		filterFile(search, function(options, nextFile) {

			fs.readFile(options.source, "utf8", nextBuilder.success(function(content) {

				ws.write(content + "\n");
				nextFile();

			}));

		}).
		start(function() {

			nextCat();

		})

	}).
	seq(function() {

		target.entry = output;
		nextBuilder();
		
	});
}

exports.taskMessage = function(target) {
	return "concat " + getInput(target).join(" + ") + " -> " + target.output;
}


function getInput(target) {
	return target.include instanceof Array ? target.include : [target.include];
}