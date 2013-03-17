var request = require("request");

exports.require = ["config"];
exports.plugin = function(config, loader) {

	var host = config.hosts.provision; //loader.params("master.host");


	return {
		request: function(method, path, data, callback) {

			var ops = {
				url: ["http://" , host, path ].join(""),
				json: data
			};

			console.log("%s %s", String(method).toUpperCase(), ops.url)

			request[method](ops, function(err, response, body){

				if(err) {
					console.error("%s %s ERROR %s", method.toUpperCase(), ops.url, err.toString());
					return callback(err);
				}

				if(body.errors) {
					callback(new Error(body.errors[0].message));
				} else {
					callback(null, body.result);
				}
			});
		}
	}
}