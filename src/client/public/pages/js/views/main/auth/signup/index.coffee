mojo = require "mojojs"

class SignupView extends mojo.View

  ###
  ###

  define: ["loading", "signupRequest", "error"]
    
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  signup: () =>
    @set "signupRequest", mojo.mediator.execute "signup", @get("user").context()

module.exports = SignupView