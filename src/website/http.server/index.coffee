exports.require = ["config", "express"]
exports.load = (config, express) ->

  server = express()
  server.listen(p = config.get("website.http.port"))

  console.log "starting express server on port #{p}"

  server

