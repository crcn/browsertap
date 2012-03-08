Controller = require "./controller"

exports.create = (config) -> new Controller().config(config)



app = exports.create({
	directory: "~/Desktop/browsers"
}).
listen(8088)


app.on "browserProxy", (proxy) ->
	


	proxy.on "locationChange", (location) ->
		console.log location.href


	proxy.on "focus", () ->
		console.log proxy.location.href




app.on "loaded", () ->
	app.start('firefox 9', 'http://google.com');
