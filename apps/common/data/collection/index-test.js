import Collection from './index';
import { BufferedBus, NoopBus } from 'mesh';
import TailableBus from 'common/mesh/bus/tailable';
import expect from 'expect.js';

describe(__filename + '#', function() {

  it('can be created', function() {
    new Collection();
  });

  it('can be created with a target array', function() {
    var c = new Collection({
      target: [9, 8, 7, 6]
    });
    expect(c.length).to.be(4);
    expect(c.at(0)).to.be(9);
    expect(c.at(3)).to.be(6);
  });

  it('can push items onto the collection', function() {
    var c = new Collection();
    c.push(5, 6, 7, 8);
    expect(c.length).to.be(4);
    expect(c.at(0)).to.be(5);
    expect(c.at(1)).to.be(6);
  });

  it('can shift items onto the collection', function() {
    var c = new Collection();
    c.unshift(5, 4, 5);
    expect(c.length).to.be(3);
    c.unshift(5, 4, 2);
    expect(c.length).to.be(6);
    expect(c.at(0)).to.be(5);
    expect(c.at(2)).to.be(2);
    expect(c.at(5)).to.be(5);
  });

  it('can pop & unshift items from the collection', function() {
    var c = new Collection({ target: [1, 2, 3, 4] });
    expect(c.length).to.be(4);
    c.pop();
    expect(c.length).to.be(3);
    c.shift();
    expect(c.length).to.be(2);
    expect(c.at(0)).to.be(2);
    expect(c.at(1)).to.be(3);
  });

  it('can call map()', function() {
    var items = (new Collection({ target: [5, 4, 3, 2] })).map(function(n) {
      return n - 1;
    });
    expect(items.join('')).to.be('4321');
  });

  it('emits a change event whenever the collection is mutated', function() {
    var c = new Collection();
    var change;
    c.on('change', function(c) {
      change = c[0];
    });
    c.push(0, 1, 2, 3);
    expect(change.removed.length).to.be(0);
    expect(change.index).to.be(0);
    expect(change.addedCount).to.be(4);

    c.shift();
    expect(change.removed.length).to.be(1);
    expect(change.index).to.be(0);
    expect(change.addedCount).to.be(0);

    c.pop();
    expect(change.removed.length).to.be(1);
    expect(change.index).to.be(c.length);
    expect(change.addedCount).to.be(0);

    c.splice(0, 2, 'a', 'b', 'c');
    expect(change.removed.length).to.be(2);
    expect(change.index).to.be(0);
    expect(change.addedCount).to.be(3);
  });
});
