var request = require("request");

exports.require = ["config"];
exports.plugin = function(config, loader) {

	var host = config.masterHost; //loader.params("master.host");


	return {
		request: function(method, path, data, callback) {

			var ops = {
				url: ["http://" ,host, path ].join(""),
				json: data
			};

			request[method](ops, function(err, response, body){

				if(err) return callback(err);

				if(body.errors) {
					callback(new Error(body.errors[0].message));
				} else {
					callback(null, body.result);
				}
			});
		}
	}
}