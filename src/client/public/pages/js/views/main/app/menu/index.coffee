mojo = require("mojojs")

class MenuView extends mojo.View

  ###
  ###

  position: 0
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  bindings:
    "models.settings.menuPosition": "position"
    "models.browser.name": "label"

  ###
  ###

  nextPosition: () ->
    if @position is 3
      @position = -1

    @set "models.settings.menuPosition", @position + 1


module.exports = MenuView