mojo = require "mojojs"

class ColumnView extends mojo.View
  
  ###
  ###

  paper: require("./column.pc")

  ###
  ###

  sections:
    options:
      type: "list"
      source: "model.options"
      modelViewClass: require("./option")

  ###
  ###

  selectOption: (option) =>

    if @_selected
      @_selected.set "selected", false

    @_selected = option
    option.set "selected", true


    if option.get("options.length")
      @_addChild option
    else
      @_open option

  ###
  ###

  _addChild: (option) ->
    if @_child
      @_child.remove()
    @_child = new ColumnView { model: option }
    @_child.render()
    @set "sections.child", @_child

  ###
  ###

  _open: (option) ->
    console.log "OPEN"





module.exports = ColumnView