exports.require = ["config", "express"]
exports.load = (config, express) ->

  server = express()
  server.listen(p = config.get("{config.get('type')}.http.port"))

  console.log "starting express server on port #{p}"

  server

