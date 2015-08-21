var createSocketBus = require("common/bus/socketio");
var io              = require("socket.io-client");
var mesh            = require("mesh");

module.exports = function(app) {

  var host    = app.get("config.socket.host");
  var channel = app.get("config.socket.channel");

  // app.logger.info("socket.io channel: %s", channel);
  // app.logger.info("socket.io host: %s", host);

  var client = io(host);
  var bus    = void 0;
  bus        = createSocketBus(channel, client, bus);

  app.bus = bus;
};
