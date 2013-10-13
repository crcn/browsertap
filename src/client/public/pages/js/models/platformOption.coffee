bindable = require "bindable"

class PlatformOption extends bindable.Object

  ###
  ###

  deselect: () ->
    @set "selected", false
    return unless @get "options.length"
    for option in @get("options").source()
      option.deselect()

  ###
  ###

  select: () ->
    @set "selected", true


    unless @get("options.length")
      @_open()

  ###
  ###

  _open: () ->
    # EXEC COMMAND

module.exports = PlatformOption