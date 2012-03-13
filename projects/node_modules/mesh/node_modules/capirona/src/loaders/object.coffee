fs = require 'fs'
step = require 'stepc'
outcome = require 'outcome'

exports.run = (object, next) -> next null, object

exports.test = (target) ->
	return typeof target == 'object'