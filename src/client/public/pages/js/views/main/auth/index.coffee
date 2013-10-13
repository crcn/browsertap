mojo = require "mojojs"

class AuthView extends mojo.View

  ###
  ###

  define: ["user"]
  
  ###
  ###
  
  paper: require("./index.pc")

  ###
  ###

  bindings:
    "models.user": "user"

  ###
  ###

  sections:
    auth:
      type: "states"
      route: "auth"
      views: [
        { class: require("./login")         , name: "login"   }
        { class: require("./forgot")        , name: "forgot"   }
        { class: require("./signup")        , name: "signup" }
      ]

module.exports = AuthView