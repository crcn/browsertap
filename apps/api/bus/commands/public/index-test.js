var createPublicCommands = require("./index");
var mesh                 = require("mesh");
var memory               = require("mesh-memory");
var expect               = require("expect.js");

describe(__filename + "#", function() {

  var bus;
  var db;
  var data;
  var dbOps;

  beforeEach(function() {
    db    = memory();
    dbOps = [];
    db = mesh.sequence(db, function(op) {
      dbOps.push(op);
      return mesh.noop();
    });
    bus = mesh.limit(1, createPublicCommands(db));
    data = [];
  });

  describe("users", function() {

    var usersBus;

    beforeEach(function() {
      usersBus = mesh.attach({ collection: "users" }, bus);
    });

    it("can register a new user", function(next) {
      usersBus({ name: "insert", data: { emailAddress: "a@b.com", password: "ccc" } });
      usersBus({ name: "load", query: { emailAddress: "a@b.com", password: "ccc" }}).on("data", data.push.bind(data)).on("end", function() {
        expect(data.length).to.be(1);
        expect(data[0].emailAddress).to.be("a@b.com");
        next();
      });
    });


    // prevent injections
    it("cannot load the user if the query param is NOT a string", function(next) {
      usersBus({ name: "insert", data: { emailAddress: "a@b.com", password: "ccc" } });
      usersBus({ name: "load", query: { password: "ccc" } });
      usersBus({ name: "load", query: { emailAddress: "a@b.com", password: { $exists: true } } });
      usersBus({ name: "load", query: { emailAddress: "a@b.com" }}).on("end", function() {
        expect(dbOps.length).to.be(2);
        next();
      });
    });

    it("can reset the password of the user", function() {
      usersBus({ name: "resetPassword", collection: "users" });
    });
  });
});
