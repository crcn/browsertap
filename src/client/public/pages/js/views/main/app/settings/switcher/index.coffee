mojo = require "mojojs"

class SwitcherView extends mojo.View

  ###
  ###

  define: ["visible"]
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  bindings:
    "models.platform": "sections.platforms.model"

  ###
  ###

  sections:
    platforms: require("./column")



module.exports = SwitcherView