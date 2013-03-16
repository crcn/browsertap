var EventEmitter = require("events").EventEmitter,
vine = require("vine");

exports.require = ["plugin-express"];
exports.load = function(server, loader, next) {

  console.log("waiting for browsertap provisioner to send server configuration");

  var em = new EventEmitter();
  em.once("complete", next);

  server.post("/config", function(req, res) {
    console.log("ping from provisioner");
    loader.params("remote.config", req.body);
    em.emit("complete", null, req.body);
    res.send(vine.result(true));
  });
}