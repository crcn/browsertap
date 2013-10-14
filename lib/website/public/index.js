// Generated by CoffeeScript 1.6.3
exports.require = ["http.server", "express", "browserify-middleware"];

exports.load = function(server, express, browserify) {
  server.use(express["static"](__dirname + "/public"));
  return server.get("/js/index.bundle.js", browserify(__dirname + "/public/js/index.js"));
};