var browserify  = require("browserify"),
browserifyFiles = require("browserify-files"),
lessMiddleware  = require("less-middleware"),
express         = require("express");


exports.require = ["http.server"];

exports.plugin = function(server, loader) {

	server.use(lessMiddleware({
		src: __dirname + "/public",
		compress: true
	}));
	
	var b = browserify({ mount:'/app.js', cache: true, watch: true });
	browserifyFiles.register(["hb"], handlebarsTemplate, b);
	b.addEntry(__dirname + "/public/app/index.js");
	server.use(b);
	server.use(express.static(__dirname + "/public"));
	server.use(express.errorHandler());
}

function handlebarsTemplate() {
	return "Ember.Handlebars.compile(\"{{{body}}}\");"
}