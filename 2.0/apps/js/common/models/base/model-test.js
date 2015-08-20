var expect    = require("expect.js");
var mesh      = require("mesh");
var BaseModel = require("./model");

describe(__filename + "#", function() {
  it("can be created", function() {
    new BaseModel();
  });

  it("can be created with properties", function() {
    expect((new BaseModel({ name: "a" })).name).to.be("a");
  });

  it("can set properties on the model", function() {
    var m = new BaseModel();
    m.setProperties({ name: "a" });
    expect(m.name).to.be("a");
  });

  it("can get() a property on the model", function() {
    var m = new BaseModel({ a: { b: "c" }});
    expect(m.get("a").b).to.be("c");
    expect(m.get("a.b")).to.be("c");
    expect(m.get("d")).to.be(void 0);
    expect(m.get("d.e.f")).to.be(void 0);
  });
});
