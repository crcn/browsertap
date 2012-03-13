

var fs = require('fs'),
step   = require('stepc'),
outcome = require('outcome');


exports.load = function(target, next) {

	var on = outcome.error(next), tasks,
	taskDir = __dirname + "/make";

	tasks = {
		"merge/:target": "merge",
		"bootstrap/:platforms": "bootstrap"
	};

	step(

		/**
		 */

		function() {

			fs.readdir(taskDir, this);

		},

		/**
		 */

		on.success(function(dirs) {

			dirs.forEach(function(dir) {

				if(dir.substr(0,1) == ".") return;

				tasks[dir] = { script: taskDir + "/" + dir };

			});

			this();
		}),

		/**
		 */

		on.success(function() {

			this(null, {

				defaultPlatform: 'node',
				directories: {
					bootstrap: __dirname + "/bootstrap"
				},
				tasks: tasks

			})
		}),


		/**
		 */

		next

	)
}