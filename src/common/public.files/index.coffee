exports.require = ["http.server", "express"]
exports.load = (server, express) ->
  server.use express.static __dirname + "/public"
  