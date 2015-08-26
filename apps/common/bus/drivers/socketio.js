var ros      = require("ros");
var mesh     = require("mesh");

/**
 */

module.exports = function(channel, client, bus) {
  return ros(
  function(listener) {
    client.on(channel, function(msg) {
      listener(msg);
    });
  },
  function(msg) {
    client.emit(channel, msg);
  }, bus || mesh.noop);
};
