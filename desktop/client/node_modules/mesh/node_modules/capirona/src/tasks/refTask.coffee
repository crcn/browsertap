BaseTask    = require("./base").Task
tpl         = require "../tpl"
path        = require "path"


###
 references another builder
###

module.exports = class RefTask extends BaseTask
	
	###
	###

	load: (@taskName) ->


	###
	 passes the build phase 
	###

	_run: (target, next) -> 
		@tasks.run @_find(target), target, next

	###
	###
	_printMessage: () ->
	
	###
	###

	_find: (target) -> 
		relPath = tpl.render @taskName, target
		tg      = if @route then @ else @parent

		if tg and relPath.substr(0, 1) == '.'
			relPath = path.normalize(tg.route.path.value + "/" + relPath)

		relPath





module.exports.test = (config) ->
	return typeof config == "string"