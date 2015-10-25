import ModelCollection from './collection';
import expect from "expect.js";

describe(__filename + '#', function() {

  it('can be created without any source', function() {
    new ModelCollection();
  });

  it("transforms the source data into model data", function() {
    var c = new ModelCollection({
      source: [{ _id: 1 }, { _id: 2 }]
    });
    expect(c.length).to.be(2);
    expect(c.at(0).source._id).to.be(1);
    expect(c.at(1).source._id).to.be(2);
  });
});
