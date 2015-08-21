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

  it("can register a command", function(next) {

    var bus = commands();

    bus.addHandler("next", function(operation, next) {
      expect(operation.name).to.be("next");
      next();
    });

    bus({ name: "next" }).on("end", next);
  });

  it("combines registered handlers together", function(next) {

    var bus = commands();

    var i = 0;

    bus.addHandler("next", function(operation, next) {
      i++;
      next();
    });

    bus.addHandler("next", function(operation, next) {
      i++;
      next();
    });

    bus({ name: "next" }).on("end", function() {
      expect(i).to.be(2);
      next();
    });
  });

  it("can remove a handler", function(next) {

    var bus = commands();

    var i = 0;

    function handle(operation, next) {
      i++;
      next();
    }

    var disposable = bus.addHandler("next", handle);

    bus({ name: "next" }).on("end", function() {
      disposable.dispose();
      bus({ name: "next" }).on("end", function() {
        expect(i).to.be(1);
        next();
      });
    });
  });

  xit("skips a handler if public is true", function(next) {
    var bus = commands();
    var i = 0;

    function handle(operation, next) {
      i++;
      next();
    }

    bus.addHandler("next", handle);

    bus({ name: "next", public: true }).on("end", function() {
      bus({ name: "next" }).on("end", function() {
        expect(i).to.be(1);
        next();
      });
    });
  });
});
