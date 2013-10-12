funwrap = require("funwrap")()
mojo    = require "mojojs"
mojo.funwrap = funwrap

funwrap.mediator.on "load"       , require("./load")
funwrap.mediator.on "initialize" , require("./initialize")
funwrap.mediator.on "bootstrap"  , require("./bootstrap")

module.exports = funwrap.mediator