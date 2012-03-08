server = require "./proxy/server"

module.exports = class 

	###
	###

	config: (config) -> 
		@directory = config.directory
		@

	###
	###

	listen: (port) ->
		server.listen(port)
		@

	