exports.require = ["http.server", "express"]
exports.load = (server, express) ->
  server.use "/vendor", express.static __dirname + "/vendor"
 