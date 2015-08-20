var commands = require("./commands");
var expect   = require("expect.js");
var mesh     = require("mesh");

describe(__filename + "#", function() {
  it("can execute a command", function(next) {

    var bus = commands({
      next: function(operation, next) {
        expect(operation.name).to.be("next");
        next();
      }
    });

    bus({ name: "next" }).on("end", next);
  });

  it("can execute a command against an existing bus", function(next) {

    var bus = commands({
      next: mesh.wrap(function(operation, next) {
        expect(operation.name).to.be("next");
        next();
      })
    });

    bus({ name: "next" }).on("end", next);
  });
});
