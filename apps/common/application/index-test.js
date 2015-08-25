var Application = require("./index");
var expect      = require("expect.js");

describe(__filename + "#", function() {
  it("can be created", function() {
    new Application();
  });

  it("can use various plugins", function() {
    var app = new Application();
    app.use(function(app) {
      app.a = "b";
    }, function(app) {
      app.setProperties({ c: "d" });
    });

    expect(app.a).to.be("b");
    expect(app.c).to.be("d");
  });

  it("automatically adds .plugins", function() {
    var app = new Application({
      plugins: [
        function(app) { app.a = "b"; },
        function(app) { app.c = "d"; }
      ]
    });
    expect(app.a).to.be("b");
    expect(app.c).to.be("d");
  });

  it("logger exists", function() {
    var app = new Application();
    expect(app.logger).not.to.be(void 0);
  });
});
