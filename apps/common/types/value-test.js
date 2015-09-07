var ValueType = require("./value");
var expect    = require("expect.js");

describe(__filename + "#", function() {

  it("can be extended and validated properly", function() {
    class AType extends ValueType {
      validate(value) {
        return value === "a";
      }
    }
    new AType("a");
    var err;
    try {
      new AType("b");
    } catch(e) {
      err = e;
    }
    expect(err.message).to.be("invalid");
  });

  it("coerces values before validating", function() {
    class AType extends ValueType {
      coerce(value) { 
        return String(value).toLowerCase();
      }
      validate(value) {
        return value === "a";
      }
    }

    new AType("a");
    var at = new AType("A");
    expect(at.value).to.be("a");
  });

  it("cannot override the value of a value type", function() {
    var v = new ValueType("blah");
    var err;
    try {
      v.value = "blarg";
    } catch(e) {
      err = e;
    }
    expect(err.message).to.contain("Cannot set property value");
  });

  it("can properly compare a value object against another value object", function() {
    expect(new ValueType(10) < new ValueType(100)).to.be(true);
  });

  it("returns true for equals", function() {
    expect(new ValueType(10).equals(new ValueType(10))).to.be(true);
  });

  it("pulls the value of a value in from the constructor", function() {
    expect(new ValueType(new ValueType(10)).valueOf()).to.be(10);
  });
});