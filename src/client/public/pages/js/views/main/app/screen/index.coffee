mojo = require "mojojs"

class ScreenView extends mojo.View
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###
  
  sections: 
    switcher: require("./switcher")


module.exports = ScreenView