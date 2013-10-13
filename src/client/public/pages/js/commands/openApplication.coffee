models = require("mojojs").models

module.exports = (mediator) ->
  mediator.on "openApplication", (option, next) ->
  
    ###debug
      console.log("opening application " + option.get("_id"))
    ###

    next()