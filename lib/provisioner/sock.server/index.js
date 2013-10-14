// Generated by CoffeeScript 1.6.3
exports.require = ["config", "sockjs", "http"];

exports.load = function(config, sockjs, http) {
  var server, sock;
  sock = sockjs.createServer();
  server = http.createServer();
  sock.installHandlers(server);
  server.listen(config.get("provisioner.port"), "0.0.0.0");
  return sock;
};
