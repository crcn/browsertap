// var createSocketBus = require("common/bus/socketio");
// var io              = require("socket.io-client");
// var mesh            = require("mesh");
var mesh = require("common/mesh");
var sa   = require("superagent");
var httperr = require("httperr");
 
module.exports = function(app) {

  var host    = app.get("config.socket.host");
  var channel = app.get("config.socket.channel");

  // app.logger.info("socket.io channel: %s", channel);
  // app.logger.info("socket.io host: %s", host);

  // var client = io(host);
  // var bus    = void 0;
  // bus        = createSocketBus(channel, client, bus);

  var bus = function(operation) {
    return new Promise(function(resolve, reject) {

      var r = sa.post("http://localhost:8080/o").send(operation).end(function(err, response) {

        var body = response.body;
        if (!body) return resolve();

        if (body.error) {
          var err = httperr[body.error.statusCode](body.error.message);
          return reject(err);
        }

        resolve(body); 
      }); 
    })
  };

  return bus;
};
