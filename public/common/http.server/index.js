// Generated by CoffeeScript 1.6.3
exports.require = ["config", "express"];

exports.load = function(config, express) {
  var p, server;
  server = express();
  server.listen(p = config.get("" + (config.get('type')) + ".http.port"));
  console.log("starting express server on port " + p);
  return server;
};
