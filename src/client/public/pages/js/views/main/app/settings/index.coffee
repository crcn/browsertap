mojo = require "mojojs"

class SettingsView extends mojo.View
  
  ###
  ###

  paper: require("./index.pc")

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
        { class: require("./tunnel"), name: "tunnel" }
      ]

module.exports = SettingsView
