var waitForEvent = require("./wait-for-event");
var expect       = require("expect.js");
var EventEmitter = require("events").EventEmitter;

describe(__filename + "#", function() {
  var em;

  beforeEach(function() {
    em = new EventEmitter();
  });

  it("can wait for an event", function(next) {
    waitForEvent(em, "event").then(next);
    em.emit("event");
  });

  it("can wait for an event after it's been emitted", function(next) {
    var p = waitForEvent(em, "event");
    em.emit("event");
    p.then(next);
  });

  it("can wait for multiple events", function(next) {
    waitForEvent(em, "a", "b", "c").then(next);
    em.emit("a");
    em.emit("b");
    em.emit("c");
  });

  it("can return data", function(next) {
    waitForEvent(em, "a", "b", "c").then(function(data) {
      expect(data).to.be(1);
      next();
    });
    em.emit("a", 1);
  });
});
