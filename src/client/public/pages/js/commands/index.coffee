funwrap = require("funwrap")()
mojo    = require "mojojs"
mojo.funwrap = funwrap
mojo.mediator = funwrap.mediator


commands = [

  require("./load"), 
  require("./waitForDOM"),
  require("./loadApplicationOptions"),
  require("./loadSettings"),

  require("./initialize"),
  require("./bootstrap"),
  require("./openApplication"),
  require("./resetPassword"),
  require("./login"),
  require("./checkSession"),
  require("./signup")
]

for command in commands
  command funwrap.mediator

module.exports = funwrap.mediator