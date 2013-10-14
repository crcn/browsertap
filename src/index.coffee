packages = require "packages"

module.exports = (type) ->

  process.env.TYPE = type
  
  console.log "starting #{type}"
  
  packages().
  require(__dirname + "/common").
  require(__dirname + "/" + type).
  load()