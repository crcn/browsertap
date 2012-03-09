var filternet = require("filternet"),
express 	  = require("express"),
dnode         = require("dnode"),
EventEmitter  = require("events").EventEmitter,
browserify    = require("browserify"),
wrapBrowserClient = require("./wrapBrowserClient"),
fs  = require("fs");


exports.listen = function(port) {

	console.log('listening to port %d', port)

	var em = new EventEmitter(),
	wrap   = wrapBrowserClient(),
	mitm = filternet.createProxyServer({ port: port}),
	assetServer = express.createServer(),
	dnodeServer,
	httpPort = port + 1;

	dnodeServer = dnode(function(client, con) {

		con.on("ready", function() {

			wrap(client, con);
			em.emit("browserProxy", client);

		});
	});


	assetServer.use(browserify({ entry: __dirname + "/client/client.js", mount:'/client.js' }));

	assetServer.listen(httpPort);
	dnodeServer.listen(assetServer);


	mitm.on("interceptResponseContent", function (buffer, responseObject, isSsl, charset, callback) {

		var content = buffer.toString("utf8");
		var script  = wrapScript("dnode.js", httpPort);
		script     += wrapScript("client.js", httpPort);

		callback(content.replace(/<\/head>/i, script + "</head>"))
	});


	return em
}


function wrapScript(path, port) {

	return "<script src=\"http://127.0.0.1:"+port+"/"+path+"?#{Math.random()}\" type=\"text/javascript\"></script>"

}
