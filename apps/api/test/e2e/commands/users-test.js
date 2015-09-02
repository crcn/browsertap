var expect = require("expect.js");
var mesh   = require("mesh");
var sift   = require("sift");
var co     = require("co");

describe(__filename + "#", function() {

  var bus;
  var fixtures = {
    user1: {
      emailAddress: "a@b.com",
      password: "password"
    }
  };

  beforeEach(function() {
    bus = mesh.limit(1, mesh.attach({ public: true, collection: "users" }, global.apiApp.bus));
  });

  describe("insert# ", function() {

    it("can register a new user", function(next) {
      
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "load", query: fixtures.user1 }).on("data", function(data) {
        expect(data.emailAddress).to.be("a@b.com");
        next();
      });
    });

    it("cannot register a user twice", function(next) {
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "insert", data:  fixtures.user1 }).on("error", function(error) {
        expect(error.statusCode).to.be(409);
        expect(error.message).to.be("user exists");
        next();
      });
    });

    it("does not return the password of the email address", function(next) {
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "load", query: fixtures.user1 }).on("data", function(data) {
        expect(data.emailAddress).to.be("a@b.com");
        expect(data.password).to.be(void 0);
        next();
      });
    });

    it("returns an error if the password is incorrect ", function(next) {
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "load", query: { emailAddress: fixtures.user1.emailAddress, password: "ABBA" } }).on("error", function(error) {
        expect(error.statusCode).to.be(401);
        next();
      });
    });

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
