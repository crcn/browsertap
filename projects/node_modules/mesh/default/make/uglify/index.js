var uglify = require('uglify-js'),
parser     = uglify.parser,
outcome    = require('outcome'),
step       = require('stepc'),
fs         = require('fs'),
utils      = require('../sardines/utils'),
async      = require('async');




exports.run = function(target, next) {
	

	step(
		function() {

			var toUglify = [], self = this;

			utils.findFiles(target.input, /\.js$/, function(file) {
				toUglify.push(file);
			}, function() {
				self(null, toUglify);
			})
		},

		next.success(function(files) {
			async.forEach(files, uglifyFile, this);
		}),
		next
	)


	function uglifyFile(file, callback) {
		
		step(
			function() {
				fs.readFile(file, "utf8", this)
			},
			next.success(function(content) {
				var body = uglify.uglify.gen_code(parser.parse(content, false, false), { beautify: target.options.beautify });
				this(null, body);
			}),
			next.success(function(body) {
				fs.writeFile(file, body, this)
			}),
			callback
		)
	}
}


exports.taskMessage = function(target) {
	return "uglify " + target.input;
}

