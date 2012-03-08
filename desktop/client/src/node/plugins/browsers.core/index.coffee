
fs           = require("fs")
step         = require("stepc")
path         = require("path")
sprintf      = require("sprintf").sprintf
loadBrowsers = require("./loadBrowsers")

exports.plugin = (router) ->

	params      = @params()
	browserDir  = params.browsers.directory.replace("~", process.env.HOME)
	allBrowsers = {}


	router.on 

		###
		###

		"pull load/+": (req, res, mw) ->


			step.async ->

				console.log "loading browsers from directory: %s", browserDir
				loadBrowsers browserDir, this

			, res.success((browsers) ->

				allBrowsers = browsers

				console.log "collecting browser info from plugins"

				router.
				request("browser/info").
				response(res.success((info) ->


				)).collect()
			)