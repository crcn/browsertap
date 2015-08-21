var serverPlugin    = require("./index");
var BaseApplication = require("common/application");
var io              = require("socket.io-client");
var socketioBus     = require("common/bus/socketio");
var mesh            = require("mesh");
var expect          = require("expect.js");

describe(__filename + "#", function() {

  var app;
  var host;
  var ops  = [];
  var port = 9081;

  beforeEach(function(next) {

    host = "http://0.0.0.0:" + port;

    app = new BaseApplication({
      plugins: BaseApplication.prototype.plugins.concat(serverPlugin),
      config: {
        log: {
          level: 0
        },
        http: {
          port: port++
        },
        socket: {
          channel: "op"
        }
      }
    });

    app.initialize(next);
  });

  afterEach(function(next) {
    app.terminate(next);
  });

  it("can pass remote operations from socket.io to the server", function(next) {

    app.commands.addHandler("someCommand", mesh.stream(function(operation, stream) {
      stream.write("hello");
      stream.end("world");
    }));

    var remoteBus = socketioBus("op", io(host));
    var data = [];

    remoteBus({ name: "someCommand" }).on("data", data.push.bind(data)).on("end", function() {
      expect(data.join(" ")).to.be("hello world");
      next();
    });
  });
});
