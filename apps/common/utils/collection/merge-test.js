import merge from './merge';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can merge new items into an existing collection', function() {

    var ec = [{ _id: 1 }, { _id: 2 }];
    var nc = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];

    var mc = merge(ec, nc, {
      equals: function(a, b) {
        return a._id === b._id;
      }
    });

    expect(mc.length).to.be(nc.length);
    expect(mc[0]).to.be(ec[0]);
  });

  it('calls remove() on the selector when items are removed', function() {

    var ec = [{ _id: 1 }, { _id: 3 }];
    var nc = [{ _id: 1 }, { _id: 2 }];

    var rm = [];

    var mc = merge(ec, nc, {
      remove: rm.push.bind(rm),
      equals: function(a, b) {
        return a._id === b._id;
      }
    });

    expect(mc.length).to.be(nc.length);
    expect(mc[0]).to.be(ec[0]);
    expect(mc[1]._id).to.be(2);

    expect(rm.length).to.be(1);
    expect(rm[0]._id).to.be(3);
  });
});
