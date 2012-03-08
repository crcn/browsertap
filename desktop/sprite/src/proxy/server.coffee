
# MITM
filternet = require "filternet"

# client
express   = require "express"

dnode     = require "dnode"

# fs
fs = require "fs"


###
###

exports.listen = (port) ->

	mitm        = filternet.createProxyServer({ port: port })
	assetServer = express.createServer()
	dnodeServer = dnode () ->
		console.log "CONNECT"

	httpPort = port + 1

	# enable JSON p
	assetServer.enable "jsonp callback"

	# server the client js
	assetServer.get "/client.js", serverScript(httpPort)




	# listen
	assetServer.listen(httpPort)
	dnodeServer.listen(assetServer)

	# start intercepting HTML
	mitm.on 'interceptResponseContent', (buffer, responseObject, isSsl, charset, callback) ->

		content = buffer.toString("utf8")
		script  = wrapScript "dnode.js", httpPort
		script += wrapScript "client.js", httpPort

		callback content.replace(/<\/head>/i, script + "</head>")


###
###

clientScript = fs.readFileSync __dirname + "/client.js", "utf8"

serverScript = (port) ->
	
	return (req, res) ->
		
		res.end clientScript.replace "{{host}}", "localhost:#{port}"


###
###

wrapScript = (path, port) ->
	"<script src=\"http://127.0.0.1:#{port}/#{path}?#{Math.random()}\" type=\"text/javascript\"></script>"

