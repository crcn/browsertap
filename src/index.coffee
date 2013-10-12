packages = require "packages"

module.exports = (type) ->
  
  console.log "starting #{type}"
  
  packages().
  require(__dirname + "/common").
  require(__dirname + "/" + type).
  load()