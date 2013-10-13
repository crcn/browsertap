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
    "visible": (value) ->
      $self = $(".screen-switcher-outer")
      if value
        $self.transit { opacity: 1 }
      else
        $self.transit { opacity: 0 }

  ###
  ###

  sections:
    platforms: require("./column")



module.exports = SwitcherView