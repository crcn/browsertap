import Application from "./index";
import expect from "expect.js";

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

  it("logger exists", function() {
    var app = new Application();
    expect(app.logger).not.to.be(void 0);
  });
});
