var express = require("express"),
browserify  = require("browserify"),
dnode       = require("dnode"),
shoe        = require("shoe"),
DesktopHook = require("./desktopHook");

exports.listen = function() {

	var server = express(), 
	port = 8080;

	server.use(express.static(__dirname + "/../public"));
	server.use(browserify({ entry: __dirname + "/../public/app/index.js", mount:'/app.js', cache: false, watch: true }));
	server.use(browserify({ entry: __dirname + "/../public/extension/index.js", mount:'/extension.js', cache: false, watch: true }));

	var desktop;
	server.listen(port);



	var desktops = [
		//"http://54.243.45.252:8000"
		// "http://ec2-23-23-57-189.compute-1.amazonaws.com:8000"
		// "http://192.168.2.3:8000"
		"http://160.94.117.248:8000"
	];

	var controller = new DesktopHook({ desktops: desktops }).connect();

	/*


	dnode({
		addDesktop: function(value) {
			desktop = value;
		}
	}).listen(port + 1);*/


	var sock = shoe(function(stream) {

		var d = dnode({

			//TODO - privision desktops
			getDesktop: function(callback) {
				controller.getAvailableDesktop(callback);
			}
		});
		d.pipe(stream).pipe(d);
	});

	sock.install(server.listen(port + 2), "/dnode");
}
