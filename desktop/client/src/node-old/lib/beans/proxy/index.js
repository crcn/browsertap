var http = require('http'),
https = require('https'),
Url = require('url'),
proxyTamper = require('proxy-tamper'),
fs = require('fs'),
tls = require('tls')

exports.plugin = function(router, params) {
	
	var server, httpsServer;

	return {

		/**
		 */

		init: function() {
			proxyTamper.start({ port: params.port || 8081})


			/*var onRequest = function(req, res) {

				var port = 443,//req.client.pair._secureEstablished ? 443 : 80,
				handle = port == 443 ? https : http;

				var urlInfo = Url.parse(req.url);
				var ops = {
					host: req.headers.host,
					port: port,
					path: urlInfo.pathname,
					method: req.method,
					headers: req.headers
				};

				console.log(ops)
				



				var preq = handle.request(ops, function(pres) {

					res.writeHead(pres.statusCode, pres.headers);
					
					pres.on('data', function(chunk) {
						res.write(chunk, 'binary');
					});


					pres.on('end', function() {
						res.end()
					});

				}).on('error', function(err) {
					console.error(err);
				});

				req.on('data', function(chunk) {
					preq.write(chunk);
				});

				req.on('end', function() {
					preq.end();
				});


			}


			var options = {
				key: fs.readFileSync(__dirname + '/privatekey.pem', 'utf8'),
				cert: fs.readFileSync(__dirname + '/certificate.pem', 'utf8') 
			}


			server = http.createServer(onRequest);
			httpsServer = https.createServer(options, onRequest);


			server.listen(params.port || 8081);
			httpsServer.listen(8082);*/

		},

		/**
		 * overrides user agent
		 */

		setUserAgent: function(userAgent) {
			
		}
	};
}