var browserify  = require("browserify"),
browserifyFiles = require("browserify-files"),
lessMiddleware  = require("less-middleware"),
express         = require("express"),
cons            = require("consolidate"),
dust            = require("dustjs-linkedin");


exports.require = ["app.http.server"];
exports.plugin = function(server) {
	
	server.use(lessMiddleware({
		src: __dirname + "/public",
		compress: true
	}));

	server.engine("dust", cons.dust);
	server.set("views", __dirname + "/views");
	server.set("view engine", "dust");

	includeScript("/js/screen.js", __dirname + "/public/app/screen.js", server);

	server.use(express.static(__dirname + "/public"));
	server.use(express.errorHandler());
}


function includeScript(mount, path, server) {
	var b = browserify({ mount:mount, cache: true, watch: true });
	browserifyFiles.register(["hb"], handlebarsTemplate, b);
	b.addEntry(path);
	server.use(b);
}

function handlebarsTemplate() {
	return "Ember.Handlebars.compile(\"{{{body}}}\");"
}