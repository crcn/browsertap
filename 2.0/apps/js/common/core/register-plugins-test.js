var plugins        = require("./register-plugins");
var BaseModel      = require("../models/base/model");
var commandsPlugin = require("../commands");
var expect         = require("expect.js");

describe(__filename + "#", function() {
  it("registers the returned value of plugins as commands on the app", function(next) {
    var app = new BaseModel();
    var ops = [];

    var ret = {
      initialize: function(op, next) {
        ops.push(op);
        next();
      }
    };

    plugins(app, [
      commandsPlugin,
      function() { return ret; },
      function() { return ret; },
      function() { return ret; }
    ]);

    app.bus({ name: "initialize" }).once("end", function() {
      expect(ops.length).to.be(3);
      next();
    });
  });

  it("removes the handlers when the app is terminated", function(next) {
    var app = new BaseModel();
    var ops = [];

    var ret = {
      initialize: function(op, next) {
        ops.push(op);
        next();
      }
    };

    plugins(app, [
      commandsPlugin,
      function() { return ret; },
      function() { return ret; },
      function() { return ret; }
    ]);

    app.bus({ name: "initialize" }).once("end", function() {
      app.bus({ name: "terminate" }).once("end", function() {
        app.bus({ name: "initialize" }).once("end", function() {
          expect(ops.length).to.be(3);
          next();
        });
      });
    });
  });
});
