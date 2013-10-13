funwrap = require("funwrap")()
mojo    = require "mojojs"
mojo.funwrap = funwrap
mojo.mediator = funwrap.mediator


commands = [
  require("./load"), 
  require("./waitForDOM"),
  require("./loadApplicationOptions"),
  require("./initialize"),
  require("./bootstrap"),
  require("./openApplication")
]

for command in commands
  command funwrap.mediator

module.exports = funwrap.mediator