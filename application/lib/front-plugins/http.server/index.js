var express = require("express"),
logger = require("winston").loggers.get("logger"),
sprintf = require("sprintf").sprintf;

exports.plugin = function(loader) {
	var port = loader.params("http.port") || 8080,
	server = express();
	server._server = server.listen(port);
	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.session({ secret: "btbrowser-token-sessid" }));
	logger.info(sprintf("listening on port %d", port));
	return server;
}