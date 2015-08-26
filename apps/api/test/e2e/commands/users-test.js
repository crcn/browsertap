var expect = require("expect.js");
var mesh   = require("mesh");
var sift   = require("sift");

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

    it("does not return the password of the email address", function(next) {
      bus({ name: "insert", data:  fixtures.user1 });
      bus({ name: "load", query: fixtures.user1 }).on("data", function(data) {
        expect(data.emailAddress).to.be("a@b.com");
        expect(data.password).to.be(void 0);
        next();
      });
    });
  });
});
