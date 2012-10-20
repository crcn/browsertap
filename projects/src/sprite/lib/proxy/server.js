var filternet = require("filternet"),
express 	  = require("express"),
dnode         = require("dnode"),
EventEmitter  = require("events").EventEmitter,
browserify    = require("browserify"),
wrapBrowserClient = require("./wrapBrowserClient"),
getBrowserInfo    = require("./browserDetect"),
fs  = require("fs");


exports.listen = function(port) {

	console.log('listening to port %d', port)

	var em = new EventEmitter(),
	mitm = filternet.createProxyServer({ port: port, transSslPort: port + 2, via: 'my test proxy/1.1', sslCerts: {
			'*': [__dirname + '/google.com.key', __dirname + "/google.com.crt"]
		}
	}),
	assetServer = express.createServer(),
	dnodeServer,
	httpPort = port + 1;

	dnodeServer = dnode(function(client, con) {

		con.on("ready", function() {
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

	mitm.on("error", function() {
		
	})


	return {

		/**
		 */


		getBrowserProxy: function(browser, callback) {

			function onProxy(proxy) {}
			em.on("browserProxy")
		} 
	}
}


function wrapScript(path, port) {

	return "<script src=\"http://127.0.0.1:"+port+"/"+path+"?#{Math.random()}\" type=\"text/javascript\"></script>"

}
