mojo = require "mojojs"

module.exports = 
  "redirect": (path) -> mojo.mediator.execute "redirect", path