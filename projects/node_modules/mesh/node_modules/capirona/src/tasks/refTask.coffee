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
		@factory.commands.run @_find(target), target, next

	###
	###
	_printMessage: () ->
	
	###
	###

	_find: (target) -> 
		relPath = if @taskName.indexOf("<%") > -1 then tpl.render @taskName, target else @taskName
		
		tg      = if @route then @ else @_findInheritable()

		if tg and relPath.substr(0, 1) == '.'
			relPath = path.normalize(tg.route.path.value + "/" + relPath)
			

		relPath





module.exports.test = (config) ->
	return typeof config == "string"