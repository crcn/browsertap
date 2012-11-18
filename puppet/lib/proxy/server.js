var filternet = require("filternet"),
express 	  = require("express"),
dnode         = require("dnode"),
EventEmitter  = require("events").EventEmitter,
browserify    = require("browserify"),
getBrowserInfo    = require("./browserDetect"),
fs  = require("fs"),
shoe = require("shoe"),
sift = require("sift"),
BrowserProxy = require("./browserProxy");


exports.listen = function(wkm, port) {

	console.log('listening to port %d', port)


	var sslPort = port + 1,
	httpPort     = sslPort + 1,
	dnodePort    = httpPort + 1,
	connections  = [],
	ret;

	var em = new EventEmitter(),
	mitm = filternet.createProxyServer({ enableCompression: false, port: port, transSslPort: sslPort, via: 'browsertap proxy/1.1', sslCerts: {
			'*': [__dirname + '/google.com.key', __dirname + "/google.com.crt"]
		}
	}),
	assetServer = express();


	assetServer.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  		res.header("Access-Control-Allow-Headers", "X-Requested-With");
  		res.header("Access-Control-Allow-Credentials", "true");
  		next();
	});


	assetServer.use(browserify({ entry: __dirname + "/client/index.js", mount:'/client.js' }));
	

	var sock = shoe(function(stream) {
		var d = dnode(function(client, con) {

			con.on("ready", function() {
				var info = getBrowserInfo(client.navigator);

				//fucking beautiful.
				wkm.windows.findWindowByTitle(client.id, function(err, window) {
					if(window) window.setProxy(client);

					console.log("FOUND WINDOW!")
					//normalize the title again
					client.foundWindow();
				})
			});
		});
		d.pipe(stream).pipe(d);
	});

	sock.on("log", function(sev, line) {
		console.log(line);
	});

	sock.install(assetServer.listen(httpPort), "/dnode");




	mitm.on("interceptResponseContent", function (buffer, responseObject, isSsl, charset, callback) {

		var content = buffer.toString("utf8");
		var script  = wrapScript("client.js?dnodeClient", httpPort);

		callback(content.replace(/<\/head>/i, script + "</head>"))
	});

	mitm.on("error", function() {
		//silence error
	})


	return ret = {

		/**
		 */


		browserProxy: function(browser) {

			proxy    = sift({ name: browser.name, version: String(browser.version) }, connections).pop();

			if(!proxy) {
				proxy = new BrowserProxy(browser);
				proxy.once("disconnect", function() {
					connections.splice(connections.indexOf(proxy), 1);
				});
				connections.push(proxy);
			}

			return proxy;
		} 
	}
}


function wrapScript(path, port) {

	return "<script src=\"http://localhost:"+port+"/"+path+"\" type=\"text/javascript\"></script>"

}
