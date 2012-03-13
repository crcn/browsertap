fs      = require 'fs'
step    = require 'stepc'
path    = require "path"
outcome = require 'outcome'

exports.run = (file, target, next) ->
	
	onResult = outcome.error next


	step.async () ->
			fs.readFile file, "utf8", @,

		,onResult.success( (content) ->

			@ null, JSON.parse content
		)

		, next

exports.test = (target) ->
	return /.json$/.test String(target)