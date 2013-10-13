bindable = require "bindable"
mojo     = require "mojojs"

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

    # return command 
    unless @get("options.length")
      @_open()

  ###
  ###

  _open: () ->
    mojo.mediator.execute("openApplication", @)

module.exports = PlatformOption