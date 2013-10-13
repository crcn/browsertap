mojo = require "mojojs"

class SettingsView extends mojo.View

  ###
  ###

  define: ["visible"]
  
  ###
  ###

  paper: require("./index.pc")


  bindings:
    "visible": (value) ->
      $self = $(".screen-switcher-outer")
      if value
        $self.transit { opacity: 1 }
      else
        $self.transit { opacity: 0 }

  ###
  ###

  sections:
    settings:
      type: "states"
      route: "settings"
      views: [
        { class: require("./options"), name: "options" },
        { class: require("./contact"), name: "contact" },
        { class: require("./extensions"), name: "extensions" },
        { class: require("./payment"), name: "payment" },
        { class: require("./help"), name: "help" },
        { class: require("./reportBug"), name: "reportBug" },
        { class: require("./switcher"), name: "browsers" },
        { class: require("./tunnel"), name: "tunnel" }
      ]

module.exports = SettingsView
