
# MITM
filternet = require "filternet"

# client
express   = require "express"

dnode     = require "dnode"


EventEmitter      = require("events").EventEmitter
browserify        = require "browserify"
wrapBrowserClient = require "./wrapBrowserClient"

# fs
fs = require "fs"


###
###

exports.listen = (port) ->
	
	em = new EventEmitter()
	wrap = wrapBrowserClient()


	mitm        = filternet.createProxyServer({ port: port })
	assetServer = express.createServer()
	dnodeServer = dnode (client, con) -> 

		con.on "ready", () ->
			wrap client, con
			em.emit "browserProxy", client

	httpPort = port + 1


	# server the client js
	assetServer.use(browserify({ entry: __dirname + "/client/client.js", mount:'/client.js' }))

	# listen
	assetServer.listen(httpPort)
	dnodeServer.listen(assetServer)

	# start intercepting HTML
	mitm.on 'interceptResponseContent', (buffer, responseObject, isSsl, charset, callback) ->

		content = buffer.toString("utf8")
		script  = wrapScript "dnode.js", httpPort
		script += wrapScript "client.js", httpPort

		callback content.replace(/<\/head>/i, script + "</head>")


	em

###
###

wrapScript = (path, port) ->
	"<script src=\"http://127.0.0.1:#{port}/#{path}?#{Math.random()}\" type=\"text/javascript\"></script>"

