import Schema from "./schema2";
import expect from "expect.js";

/*

class EmailAddressSchema extends Schema {
  
}

class PasswordSchema extends Schema {
  serialize() {
  
  }
  equals() {
    
  }
}

class UserSchema extends MongoSchema {
  $name: "user",
  emailAddress: new EmailAddressSchema()
  password: new PasswordSchema
}

*/


describe(__filename + "#", function() {

  it("can be created", function() {
    new Schema();
  });

  it("can set mongodb properties on the schema & validate against a value", function() {

    var schema = new Schema({
      $eq: /a|b/
    });

    expect(schema.validate("a")).to.be(true);
  });

  it("can validate against a schema and return an error", function() {
    var schema = new Schema({
      $eq: /a|b/
    });

    expect(schema.validate("c").message).to.be("invalid");
  });

  it("returns a 'bad request' error if the schema is invalid", function() {
    var schema = new Schema({
      $eq: /a|b/
    });
    expect(schema.validate("c").statusCode).to.be(400);
  });

  it("validates true if the schema is not present and $req is false", function() {
    var schema = new Schema({
      $req: false,
      $eq: /a|b/
    });
    expect(schema.validate(void 0)).to.be(true);
  });

  it("validates false if $req is absent and the schema value is undefined", function() {
    var schema = new Schema({
      $eq: /a|b/
    });
    expect(schema.validate(void 0)).not.to.be(true);
  });

  it("combines the $name in the error message", function() {
    var schema = new Schema({
      $name: "fieldName",
      $eq: /a|b/
    });
    expect(schema.validate(void 0).message).to.be("fieldName.invalid");
  });


});