require("events").EventEmitter.defaultMaxListeners = 9999

require "./models"
require "./template"
commands = require "./commands"
MainView = require "./views/main"



commands.execute "load", () ->

  ###debug
    console.log("initialize application")
  ###

  view = new MainView()
  view.attach $ "#application"