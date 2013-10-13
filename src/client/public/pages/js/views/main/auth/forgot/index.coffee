mojo = require "mojojs"

class ForgotView extends mojo.View

  ###
  ###

  define: ["resetRequest", "loading", "error", "success"]
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  bindings:
    "resetRequest.loading": "loading"
    "resetRequest.success": "success"
    "resetRequest.error"  : "error"

  ###
  ###

  reset: () =>
    @set "resetRequest", mojo.mediator.execute "resetPassword", @get("user").context()


module.exports = ForgotView 