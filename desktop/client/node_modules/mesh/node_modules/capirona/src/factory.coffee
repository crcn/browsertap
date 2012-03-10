fs            = require "fs"
path          = require "path"
step          = require "stepc"
outcome       = require "outcome"


###
 creates new builders based on configs given
###

module.exports = class Factory
	
	###
	###

	constructor: () ->
		@_classes = []
		
	###
	 adds a builder class - must also be a tester
	###

	add: (clazz) ->

		@_classes.push clazz

	###
	 returns a new builder based on the options given. CWD is also
	 important since SOME builders may load from disc
	###

	newTask: (name, ops, parent) ->


		for clazz in @_classes

			if clazz.test ops
				
				# new builder 
				task = new clazz name, @tasks, parent

				# load it with the options given
				task.load ops

				# return the builder
				return task
		
		# no builder? return null
		null