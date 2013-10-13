models = require("mojojs").models

###
 loads the users settings
###

module.exports = (mediator) ->
  mediator.on "pre load", (options..., next) ->

    ###debug
      console.log("loading application settings");
    ###

    models.set 
      settings: 
        showChrome: false
        highQuality: false
        sound: false


    next()