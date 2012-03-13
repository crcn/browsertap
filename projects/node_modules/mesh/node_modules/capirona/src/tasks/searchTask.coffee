BaseTask    = require("./base").Task
handlebars  = require "handlebars"
walkr       = require "walkr"
structr     = require "structr"
outcome     = require "outcome"
tpl         = require "../tpl"

###
 the ENTRY point into the build system
###

module.exports = class SearchTask extends BaseTask
	
	###
	###

	load: (@options) ->
	

		tasks = @findTasks = []

		for search of options.find
			tasks.push({
				search: new RegExp(search),
				task: @childTask(null, options.find[search])
			})

	###
	 passes the build phase 
	###

	_run: (target, nextTask) -> 


		dir = tpl.render @options.directory, target

		target = structr.copy(target)

		walkr(dir).
		filter (options, next) =>
			
			for filt in @findTasks
				if filt.search.test(options.source)
					return filt.task.run structr.copy({ file: options.source }, target), nextTask.success () ->
							next()

			next()

		.start nextTask
			
	###
	###

	_printMessage: ->
		




module.exports.test = (config) ->
	return !!config.directory && !!config.find