import waitForEvent from "./wait-for-event";
import expect from "expect.js";
import {EventEmitter} from "events";

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
