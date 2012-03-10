var walkr = require("walkr"),
fs        = require("fs"),
seq       = require("seq");

exports.run = function(target, nextBuilder) {


	var ops = target,
	include = ops.include instanceof Array ? ops.include : [ops.include],
	output  = ops.output,
	ws      = fs.createWriteStream(output);



	seq(include).
	seqEach(function(file) {
			
		var nextCat = this;

		walkr(file).
		filterFile(/\.js$/, function(options, nextFile) {

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