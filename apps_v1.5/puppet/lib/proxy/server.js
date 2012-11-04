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


exports.listen = function(port) {

	console.log('listening to port %d', port)


	var sslPort  = port + 1,
	httpPort     = sslPort + 1,
	dnodePort    = httpPort + 1,
	connections  = [],
	ret;

	var em = new EventEmitter(),
	mitm = filternet.createProxyServer({ port: port, transSslPort: sslPort, via: 'my test proxy/1.1', sslCerts: {
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


	assetServer.use(browserify({ entry: __dirname + "/client/index.js", mount:'/client.js', watch: true, cache: false }));
	assetServer.use(express.static(__dirname + "/client"));

	var sock = shoe(function(stream) {
		var d = dnode(function(client, con) {

			var proxy;

			con.on("ready", function() {
				var info = getBrowserInfo(client.navigator);
				ret.browserProxy(info).listen(client, con);
			});
			con.on("end", function() {
				console.log("EXIT")
			})
		});
		d.pipe(stream).pipe(d);
	});

	sock.on("log", function(sev, line) {
		console.log(line);
	});

	var hopts = {
		// protocols_whitelist: ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'],
		// protocols_whitelist: ['xhr-streaming'],
		prefix: "/dnode"
	}

	sock.install(assetServer.listen(httpPort), hopts);




	mitm.on("interceptResponseContent", function (buffer, responseObject, isSsl, charset, callback) {

		var content = buffer.toString("utf8");
		var script  = wrapScript("client.js?dnodeClient", httpPort);
		var cssFix  = wrapCss("/css-fix.css", httpPort);

		callback(content.replace(/<\/head>/i, script + cssFix + "</head>"))
	});

	mitm.on("error", function() {
		//silence error
	})


	return ret = {

		/**
		 */

		browserProxy: function(browser) {

			proxy    = sift({ name: browser.name, version: String(browser.version) }, connections).pop();

			//console.log({ name: browser.name, version: String(browser.version) });

			if(!proxy) {
				proxy = new BrowserProxy(browser);
				connections.push(proxy);
			}

			return proxy;
		} 
	}
}


function wrapScript(path, port) {
	return "<script src=\"http://localhost:"+port+"/"+path+"\" type=\"text/javascript\"></script>"
}

function wrapCss(path, port) {
	return "<link rel=\"stylesheet\" href=\"http://localhost:"+port+"/"+path+"\" type=\"text/css\">"
}
