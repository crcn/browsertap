import ModelCollection from './collection';
import DataObject from '../object';
import expect from 'expect.js';
import testUtils from 'common/test/utils';
import sift from 'sift';

describe(__filename + '#', function() {

  it('can be created without any source', function() {
    new ModelCollection();
  });

  it('transforms the source data into model data', function() {
    var c = new ModelCollection({
      source: [{ _id: 1 }, { _id: 2 }]
    });
    expect(c.length).to.be(2);
    expect(c.at(0).source._id).to.be(1);
    expect(c.at(1).source._id).to.be(2);
  });

  it('merges data when the source changes', function() {

    var c = new ModelCollection({
      source: [{ _id: 1 }, { _id: 2 }]
    });

    var m1 = c.at(0);

    c.setProperties({
      source: [{ _id: 1, name: 'a' }, { _id: 2 }, { _id: 3, name: 'b' }]
    });

    expect(m1.source.name).to.be('a');
    expect(c.length).to.be(3);
    expect(c.at(2).source.name).to.be('b');
  });

  it('removes items from the collection', function() {
    var c = new ModelCollection({
      source: [{_id: 1}, {_id:2},{_id:3}]
    });

    c.setProperties({
      source: [{_id:1},{_id:4}]
    });

    expect(c.length).to.be(2);
  });

  it('emits a change event when the collection changes', async function() {
    var changes = [];
    var c = new ModelCollection({
      source: [{_id: 1}, {_id:2},{_id:3}]
    });
    c.watch(function(c) {
      changes = c;
    });

    c.setProperties({
      source: [{_id:1},{_id:4}]
    });

    await testUtils.timeout(0);
    expect(changes.filter(sift({ name: 'target' })).length).to.be(1);
  });

  it('calls dispose() on the models that have been removed', async function() {
    var _disposeCount = 0;

    class ModelClass extends DataObject {
      dispose() {
        _disposeCount++;
      }
    }
    var c = new ModelCollection({
      modelClass: ModelClass,
      source: [{_id:1},{_id:2},{_id:3},{_id:4}]
    });
    c.setProperties({
      source: [{_id:1},{_id:3}]
    });
    await testUtils.timeout(0);
    expect(_disposeCount).to.be(2);
  });

  it('syncs from the getSourceCollection()', async function() {
    var c = new ModelCollection({
      source: [{_id:1},{_id:2}]
    });
    var sc = c.getSourceCollection();
    sc.push({_id:3});

    // should be async at this point
    expect(c.length).to.be(2);
    await testUtils.timeout(0);
    expect(c.length).to.be(3);

    sc.shift();
    await testUtils.timeout(0);
    expect(c.length).to.be(2);
  });

  it('syncs source to the source collection', async function() {
    var c = new ModelCollection({
      source: [{_id:1},{_id:2}]
    });
    var sc = c.getSourceCollection();
    sc.push({_id:3});
    await testUtils.timeout(0);
    expect(c.length).to.be(3);

    c.setProperties({ source: [{_id:3}] });
    await testUtils.timeout(0);
    expect(c.length).to.be(1);
    expect(sc.length).to.be(1);

  });
});
