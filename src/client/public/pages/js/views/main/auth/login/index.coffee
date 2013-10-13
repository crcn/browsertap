mojo = require "mojojs"


class LoginView extends mojo.View
  
  ###
  ###

  define: ["loading", "loginRequest", "error"]

  ###
  ###

  bindings:
    "loginRequest.loading": "loading"
    "loginRequest.error": "error"
    
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  login: () =>
    @set "loginRequest", mojo.mediator.execute "login", @get("user").context(0)



module.exports = LoginView