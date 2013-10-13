mojo = require "mojojs"

class AppView extends mojo.View
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  bindings:
    "models.browser": "browser"

  ###
  ###

  sections:
    app:
      type: "states"
      route: "app"
      views: [
        { class: require("./screen"), name: "screen" }
      ]
    settings: require("./settings")
    menu: require("./menu")
    loader: require("./loader")

module.exports = AppView