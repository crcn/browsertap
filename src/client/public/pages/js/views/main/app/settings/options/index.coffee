mojo = require("mojojs")

cells = 

class OptionsView extends mojo.View
  
  ###
  ###

  paper: require("./index.pc")

  ###
  ###

  toggleQuality: () ->
    console.log "toggle quality"

  ###
  ###

  toggleSound: () ->
    console.log "toggle sound"

  ###
  ###

  showHideBrowserChrome: () ->
    console.log "show / hide browser"

  ###
  ###

  pauseBrowser: () ->
    console.log "pause browser"

module.exports = OptionsView