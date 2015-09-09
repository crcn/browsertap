
import mesh from "mesh";
import sift from "sift";
import createInterceptBus from "./intercept";
import expect from "expect.js";

describe(__filename + "#", function() {

  var bus;
  var ops;

  beforeEach(function() {

    ops = [];

    bus = mesh.wrap(function(operation, next) {
      ops.push(operation);
      next();
    });

    bus = mesh.limit(1, bus);
    bus = createInterceptBus(bus);

  });

  it("can intercept operations based on a query", function(next) {
    var i = 0;

    bus({
      name: "intercept",
      query: { name: "test" },
      bus: mesh.wrap(function(operation, next) {
        i++;
        next();
      })
    });

    bus({ name: "test" }).on("end", function() {
      expect(i).to.be(1);
      next();
    });
  });

  it("can intercept and return an error", function(next) {

    bus({
      name: "intercept",
      query: { name: "test" },
      bus: mesh.wrap(function(operation, next) {
        next(new Error("error"));
      })
    });

    bus({ name: "test" }).on("error", function() {
      expect(ops.length).to.be(0);
      next();
    });
  });

  it("can dispose an interceptor", function(next) {
    var i = 0;

    var interceptor = bus({
      name: "intercept",
      query: { name: "test" },
      bus: mesh.wrap(function(operation, next) {
        i++;
        next();
      })
    });

    bus({ name: "test" }).on("end", function() {
      interceptor.end();
      bus({ name: "test" }).on("end", function() {
        expect(i).to.be(1);
        next();
      });
    });
  });

  it("can specify max interceptions", function(next) {
    var i = 0;

    var interceptor = bus({
      name: "intercept",
      max: 1,
      query: { name: "test" },
      bus: mesh.wrap(function(operation, next) {
        i++;
        next();
      })
    });

    bus({ name: "test" }).on("end", function() {
      bus({ name: "test" }).on("end", function() {
        expect(i).to.be(1);
        next();
      });
    });
  });
});
