var request = require("request");

exports.plugin = function(loader) {

	var host = loader.params("master.host");

	console.log(host)

	return {
		request: function(method, path, data, callback) {
			var ops = {
				url: ["http://" ,host, path ].join(""),
				json: data
			};

			//console.log("request: %s", ops.url);


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