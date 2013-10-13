commands = require "./commands"
require "./models"
require "./template"
MainView = require "./views/main"



commands.execute "bootstrap", () ->

  ###debug
    console.log("initialize application")
  ###

  view = new MainView()
  view.attach $ "#application"