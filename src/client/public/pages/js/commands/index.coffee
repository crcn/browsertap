funwrap = require("funwrap")()
mojo    = require "mojojs"
mojo.funwrap = funwrap
mojo.mediator = funwrap.mediator

funwrap.mediator.on "load"         , require("./load")
funwrap.mediator.on "initialize"   , require("./initialize")
funwrap.mediator.on "bootstrap"    , require("./bootstrap")
funwrap.mediator.on "openApplication"  , require("./openApplication")

module.exports = funwrap.mediator