mousetrap = require "mousetrap"

module.exports = (mediator) ->
  mediator.on "pre initialize", (options..., next) ->

    execute = (cmd, options ) ->
      () ->
        ###debug
          console.log("key command: ", cmd)
        ###
        mojo.mediator.execute cmd, options
    ###debug
      console.log("adding keyboard commands");
    ###

    mousetrap.bind ["ctrl+f"], execute "toggleChrome"
    mousetrap.bind ["ctrl+q"], execute "toggleQuality"
    mousetrap.bind ["ctrl+o"], execute "redirect", "settings"
    mousetrap.bind ["ctrl+s"], execute "toggleSound"
    mousetrap.bind ["ctrl+x"], execute "redirect", "browsers"
    mousetrap.bind ["ctrl+t"], execute "redirect", "extensions"
    mousetrap.bind ["ctrl+space"], execute "pauseBrowser"
      
    next()

