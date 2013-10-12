mojo = require "mojojs"

class AuthView extends mojo.View
  
  paper: require("./index.pc")

  sections:
    auth:
      type: "states"
      index: 0
      views: [
        { class: require("./login"), name: "login"   }
        { class: require("./signup"), name: "signup" }
      ]

module.exports = AuthView