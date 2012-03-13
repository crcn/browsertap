BaseTask    = require("./base").Task
fs          = require "fs"
structr		= require "structr"
path        = require "path"

###
 builds from a .js file
###

module.exports = class IncludeTask extends BaseTask
	
	###
	###

	load: (ops) ->


		regex = new RegExp(ops.include.replace('*','.*?'))
		dirpath = path.dirname ops.include

		usable = []		
		for file in fs.readdirSync dirpath
			fullPath = "#{dirpath}/#{file}"
			usable.push fullPath if regex.test fullPath


		for include in usable


			route = structr.copy @route

			# route.path.segments.push { value: path.basename(include).split('.').shift() }


			cfg = JSON.parse fs.readFileSync(include, "utf8")

			# load the target script
			@tasks.load cfg, route

	###
	 passes the build phase @
	###

	_run: (target, next) -> 

		next()



module.exports.test = (config) ->
	return !!config.include