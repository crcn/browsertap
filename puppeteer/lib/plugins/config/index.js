var EventEmitter = require("events").EventEmitter;

/**
 * loads the config which is sent from browsertap
 */

exports.require = ["plugin-express"];
exports.load = function(server, loader, next) {

  var em = new EventEmitter();

  em.once("config", next);

  //TODO - security here.
  server.post("/config", function(req, res) {
    em.emit("config", req.body);
    res.end("OK");
  });


  server.get("/browsers", function() {

  });
}