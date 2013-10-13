require("events").EventEmitter.defaultMaxListeners = 9999

commands = require "./commands"
require "./models"
require "./template"
require "./views/decorators"
require "./views/components"
require "./routes"
MainView = require "./views/main"



commands.execute "bootstrap", () ->

  ###debug
    console.log("initialize application")
  ###

  view = new MainView()
  view.attach $ "#application"