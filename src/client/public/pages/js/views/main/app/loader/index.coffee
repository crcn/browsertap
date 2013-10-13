mojo = require "mojojs"

class LoaderView extends mojo.View
  
  ###
  ###
  
  define: ["loading"]
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  bindings:
    "models.browser.loading": "loading"

module.exports = LoaderView