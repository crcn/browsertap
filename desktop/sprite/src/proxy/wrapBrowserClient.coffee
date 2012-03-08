EventEmitter = require("events").EventEmitter

module.exports = () ->
	
	currentWindow = null

	(remote, con) ->


		remote.on "mousemove", () ->


			if currentWindow and currentWindow isnt remote
				currentWindow.isFocus = false

			if not remote.isFocus
				remote.emit "focus" 

			remote.isFocus = true 
			currentWindow = remote






