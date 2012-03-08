server = require "./proxy/server"
EventEmitter = require("events").EventEmitter

module.exports = class extends EventEmitter

	###
	###

	config: (config) -> 
		@directory = config.directory
		@

	###
	###

	listen: (port) ->
		em = server.listen(port)
		em.on "browserProxy", (proxy) => @emit "browserProxy", proxy
		@

	