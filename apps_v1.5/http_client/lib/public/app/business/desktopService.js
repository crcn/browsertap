var dnode = require("dnode"),
shoe      = require("shoe"),
Url       = require("url");

exports.connect = function(options, callback) {

	console.log(options.host)
	var stream = shoe(options.host);

	var d = dnode();

	d.on("remote", function(remote) {

		function getDesktop() {
			remote.getDesktop(function(err, desktop) {
				if(err) return callback(err);
				desktop.connect({}, function(err, puppet) {
					// puppet.dnode = desktop.host;
					puppet.rtmp = desktop.rtmp;
					callback(null, puppet);
				})
			});	
		}

		getDesktop();
	});

	d.pipe(stream).pipe(d);


}
