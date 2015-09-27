// var createSocketBus = require("common/bus/socketio");
// var io              = require("socket.io-client");
// var mesh            = require("mesh");
var mesh = require("common/mesh");
var sa   = require("superagent");
var httperr = require("httperr");
 
module.exports = function(app, bus) {

  var host    = app.get("config.hosts.api");
  // var channel = app.get("config.socket.channel");

  // app.logger.info("socket.io channel: %s", channel);
  app.logger.info("api host: %s", host);

  // var client = io(host);
  // var bus    = void 0;
  // bus        = createSocketBus(channel, client, bus);

  if (!bus) bus = mesh.noop;
  if (!process.browser) return bus;

  var bus = function(operation) {

    var resp = new mesh.AsyncResponse();

    var r = sa.post("/o").send(operation).end(function(err, response) {
      var body = response.body;
      if (!body) return resolve();

      if (body.error) {
        var err = httperr[body.error.statusCode](body.error.message);
        return resp.emit("error", err);
      }

      resp.end(body);
    }); 

    return resp;
  };

  return bus;
};
