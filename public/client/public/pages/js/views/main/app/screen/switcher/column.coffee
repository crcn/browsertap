mojo = require "mojojs"

class ColumnView extends mojo.View

  ###
  ###

  define: ["selectOptionRequest"]
  
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

  _onRender: () ->
    super()

  ###
  ###

  selectOption: (option) =>

    @_selected?.deselect()

    @_selected = option
    @set "selectOptionRequest" option.select()

    if option.get("options.length")
      @_addChild option

  ###
  ###

  _addChild: (option) ->
    if @_child
      @_child.remove()
    @_child = new ColumnView { model: option }
    @_child.render()
    @set "sections.child", @_child


module.exports = ColumnView