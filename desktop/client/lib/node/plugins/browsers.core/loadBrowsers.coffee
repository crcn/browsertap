outcome = require("outcome")
step = require("stepc")
fs = require("fs")
path = require("path")
async = require("async")
# ApplcationManager = require  "./proc/ApplicationManager"

module.exports = (directory, callback) ->

  on_ = outcome.error(callback)

  step.async ->

    fs.readdir directory, this

  ##
  ##

  , on_.success((dirs) ->

    browsers = {}
    async.map fixPaths(directory, dirs), loadBrowser, this

  ##
  ##

  ), on_.success((browsers) ->

    toObj = {}

    browsers.forEach (browser) ->
      toObj[browser.name.toLowerCase()] = browser

    callback null, toObj
  )

###
###

loadBrowser = (directory, callback) ->

  on_ = outcome.error(callback)

  browser =
    name: path.basename(directory)
    executables: []


  step.async ->

    fs.readdir directory, this

  ##
  ##

  , on_.success((executables) ->


    browser.executables = fixPaths(directory, executables)
    this null, browser

  ), 

  ##
  ##

  callback

###
###


fixPaths = (parent, paths) ->

  paths.filter((dir) ->

    parent.substr(0, 1) isnt "."

  ).map (dir) ->

    path.normalize parent + "/" + dir
