exports.require = ["config", "sockjs", "http"]
exports.load = (config, sockjs, http) ->
  sock = sockjs.createServer()
  server = http.createServer()
  sock.installHandlers(server)
  server.listen(config.get("provisioner.port"), "0.0.0.0")
  sock


