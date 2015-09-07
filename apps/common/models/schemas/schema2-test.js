var Schema = require("./schema");
var expect = require("expect.js");
var co     = require("co");


describe(__filename + "#", function() {
  it("can be created", function() {
    new Schema();
  });

  return;

  it("can validate with just a required property", function() {

    var schema = new Schema({
      a: {
        required: true
      }
    });

    expect(schema.validate({ })).not.to.be(void 0);
    expect(schema.validate({ a: null })).not.to.be(void 0);
    expect(schema.validate({ a: void 0 })).not.to.be(void 0);
    expect(schema.validate({ a: 0 })).to.be(void 0);
    expect(schema.validate({ a: false })).to.be(void 0);
  });

  it("can add a validator to the property without a required field", function() {

    var schema = new Schema({
      a: {
        validate: { $eq: /aa|bb/ }
      }
    });

    expect(schema.validate({ a: "cc" })).not.to.be(void 0);
    expect(schema.validate({ a: "aa" })).to.be(void 0);
    expect(schema.validate({ a: "bb" })).to.be(void 0);
    expect(schema.validate({ })).to.be(void 0);
  });

  it("can add a validator to the property with a required field", function() {

    var schema = new Schema({
      a: {
        required: true,
        validate: { $eq: /aa|bb/ }
      }
    });

    expect(schema.validate({ a: "aa" })).to.be(void 0);
    expect(schema.validate({ })).not.to.be(void 0);
  });

  it("can add a validator to the property with a required field", function() {

    var schema = new Schema({
      a: {
        required: true,
        validate: { $eq: /aa|bb/ }
      }
    });

    expect(schema.validate({ a: "aa" })).to.be(void 0);
    expect(schema.validate({ })).not.to.be(void 0);
  });

  it("can validate specific properties", function() {

    var schema = new Schema({
      a: {
        validate: { $eq: "a" }
      },
      b: {
        validate: { $eq: "b" }
      }
    });

    expect(schema.validate({ property: "a" }, { a: "a", b: "c" })).to.be(true);
    expect(schema.validate({ property: /a|b/ }, { a: "a", b: "c" })).to.be(false);
  });

  it("can pluck properties from the data based on the schema", function() {

    var schema = new Schema({
      a: {
        private: true,
        validate: { $eq: "a" }
      },
      b: {
        validate: { $eq: "b" }
      }
    });

    expect(schema.pluck({ private: true }, { a: "b", b: "c" }).a).to.be("b");
    expect(schema.pluck({ private: { $ne: true } }, { a: "b", b: "c" }).a).to.be(void 0);
  });

  it("can map values", function() {

    var schema = new Schema({
      a: {
        private: true,
        serialize: function(v) {
          return v.toUpperCase();
        },
        validate: { $eq: "a" }
      },
      b: {
        validate: { $eq: "b" }
      }
    });

    var newData = schema.serialize({ a: "b", b: "c" });
    expect(newData.a).to.be("B");
    expect(newData.b).to.be("c");
  });
});
