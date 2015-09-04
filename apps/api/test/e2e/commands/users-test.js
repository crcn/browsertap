
var expect = require("expect.js");
var mesh   = require("mesh");
var sift   = require("sift");
var co     = require("co");
var runOp  = require("common/utils/bus/create-promise");

describe(__filename + "#", function() {

  var bus;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password"
    }
  };

  return;
  w
  beforeEach(function() {
    bus = mesh.limit(1, mesh.attach({ public: true, collection: "users" }, global.apiApp.bus));
  });

  describe("insert# ", function() {

    it("can register a new user", co.wrap(function*() {
      yield runOp(bus, { name: "insert", data:  fixtures.user1 });
      var data = yield runOp(bus, { name: "load", query: fixtures.user1 });
      expect(data.emailAddress).to.be("a@b.com");
    }));

    it("cannot register a user twice", co.wrap(function*() {
      yield runOp(bus, { name: "insert", data:  fixtures.user1 });

      var error;
      try {
        yield runOp(bus, { name: "insert", data:  fixtures.user1 });
      } catch(e) {
        error = e;
      }

      expect(error.statusCode).to.be(409);
      expect(error.message).to.be("user exists");
    }));

    it("does not return the password of the email address", co.wrap(function*() {
      yield runOp(bus, { name: "insert", data:  fixtures.user1 });
      var data = yield runOp(bus, { name: "load", query: fixtures.user1 });
      expect(data.emailAddress).to.be("a@b.com");
      expect(data.password).to.be(void 0);
    }));

    it("returns an error if the password is incorrect ", co.wrap(function*() {
      yield runOp(bus, { name: "insert", data:  fixtures.user1 });

      var error;

      try {
        var data = yield runOp(bus, { name: "load", query: { emailAddress: fixtures.user1.emailAddress, password: "ABBA" } });
      } catch(e) {
        error = e;
      }
      expect(error.statusCode).to.be(401);
    }));

    xit("returns a 404 if password is not present for load query", function(next) {
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "load", query: { emailAddress: fixtures.user1.emailAddress } }).on("error", function(error) {
        expect(error.statusCode).to.be(404);
        next();
      });
    });

    it("can reset a password", function(next) {
      // bus({ name: "insert", data:  fixtures.user1 });
      // bus({ name: "" });
      next();
    });
  });
});
