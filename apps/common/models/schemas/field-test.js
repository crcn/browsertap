import Field from "./field";
import expect from "expect.js"

describe(__filename + "#", function() {

  it("can be created", function() {
    expect(new Field("field").name).to.be("field");
  });

  it("can set mongodb properties on the field & validate against a value", function() {

    var field = new Field("field", {
      $eq: /a|b/
    });

    expect(field.validate("a")).to.be(true);
  });

  it("can validate against a field and return an error", function() {
    var field = new Field("field", {
      $eq: /a|b/
    });

    expect(field.validate("c").message).to.be("invalid");
  });

  it("returns a 'bad request' error if the field is invalid", function() {
    var field = new Field("field", {
      $eq: /a|b/
    });
    expect(field.validate("c").statusCode).to.be(400);
  });

  it("validates true if the field is not present and $req is false", function() {
    var field = new Field("field", {
      $req: false,
      $eq: /a|b/
    });
    expect(field.validate(void 0)).to.be(true);
  });

  it("validates false if $req is absent and the field value is undefined", function() {
    var field = new Field("field", {
      $eq: /a|b/
    });
    expect(field.validate(void 0)).not.to.be(true);
  });
});