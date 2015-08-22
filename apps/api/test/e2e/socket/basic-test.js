var io              = require("socket.io-client");
var socketioBus     = require("common/bus/socketio");
var mesh            = require("mesh");
var expect          = require("expect.js");

describe(__filename + "#", function() {

  it("can pass remote operations from socket.io to the server", function(next) {

    global.apiApp.publicCommands.addHandler("someCommand", mesh.stream(function(operation, stream) {
      stream.write("hello");
      stream.end("world");
    }));

    var remoteBus = socketioBus(global.apiApp.get("config.socket.channel"), io(global.apiApp.get("config.socket.host")));
    var data = [];

    remoteBus({ name: "someCommand" }).on("data", data.push.bind(data)).on("end", function() {
      expect(data.join(" ")).to.be("hello world");
      next();
    });
  });
});
