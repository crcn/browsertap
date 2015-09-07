import ObjectType from "./object";
import ValueType from "./value";
import expect from "expect.js"

describe(__filename + "#", function() {

  class AType extends ValueType {
    coerce(value) {
      return value ? value.toLowerCase() : void 0;
    }
    validate(value) {
      return value === "a";
    }
  }

  it("can be created & validated on the spot", function() {
    class Obj extends ObjectType {
      get fields() {
        return {
          a: AType
        }
      }
    }

    var obj = new Obj({
      a: "A"
    });

    expect(obj.a.valueOf()).to.be("a");

    var err;

    try {
      new Obj();
    } catch(e) {
      err = e;
    }
    
    expect(err.message).to.be("a.invalid");
  });
});