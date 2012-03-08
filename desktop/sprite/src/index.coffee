Controller = require "./controller"

exports.create = () -> new Controller()


#filternet = require("filternet")

###
proxy = filternet.createProxyServer({ port: 8088 })

proxy.on "interceptResponseContent", (buffer, responseObject, isSsl, charset, callback) ->
	console.log(responseObject)
	console.log("GO")
	content = buffer.toString('utf8')
	css = "<"+"link rel='stylesheet' href='http://axiak.github.com/filternet/blink.css'>"
	callback(content.replace(/<\/head>/i, css + "</head>"))
###
