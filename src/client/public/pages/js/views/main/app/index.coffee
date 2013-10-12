mojo = require "mojojs"

class AppView extends mojo.View
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  sections:
    type: "states"
    index: 0
    views: [
      { class: require("./screen"), name: "screen" }
    ]

module.exports = AppView