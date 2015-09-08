import mixinSchema  from "./mixin"
import EmailAddress from "common/data/types/email-address"
import Schema       from "./schema"
import expect       from "expect.js"

describe(__filename + "#", function() {

  var locationSchema = new Schema({
    fields: {
      city   : String,
      state  : String,
      zip    : Number,
      street : String
    }
  });

  @mixinSchema(locationSchema)
  class Location { }

  var personSchema = new Schema({
    fields: {
      emailAddress: EmailAddress,
      fullName: String,
      location: Location
    }
  });

  @mixinSchema(personSchema)
  class Person { }

  it("can be wrapped around any class", function() {

    var m = new Person({
      emailAddress: "a@b.com",
      location: {
        city: "San Francisco",
        state: "CA",
        zip: 94102
      }
    });

    expect(m.emailAddress instanceof EmailAddress).to.be(true);
    expect(m.location instanceof Location).to.be(true);
    expect(m.location.zip.valueOf()).to.be(94102);
  });

  it("can properly be serialized into a json object", function() {

    var m = new Person({
      emailAddress: "a@b.com",
      location: {
        city: "San Francisco"
      }
    });

    var obj = JSON.parse(JSON.stringify(m));
    expect(obj.emailAddress).to.be("a@b.com");
    expect(obj.location.city).to.be("San Francisco");
    expect(obj.location.state).to.be(void 0);
  });
});