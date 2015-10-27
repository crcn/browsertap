import expect from 'expect.js';
import BaseModel from './model';
import Schema from 'common/data/schema/schema';
import MemoryDbBus from 'common/mesh/bus/memory';
import { TailableBus, WrapBus, AcceptBus } from 'mesh';
import { timeout } from 'common/test/utils';
import sift from 'sift';

describe(__filename + '#', function() {

  var bus;

  beforeEach(function() {
    bus = MemoryDbBus.create();
    bus = TailableBus.create(bus);
    bus = AcceptBus.create(sift({ action: 'tail' }), WrapBus.create(bus.createTail.bind(bus)), bus);
  });

  it('can be created', function() {
    new BaseModel();
  });

  class SubModel extends BaseModel {
    static collectionName = 'items';
    constructor(properties) {
        super(new Schema(), properties);
    }
  }

  it('can find items items against a db', async function() {
    await bus.execute({ action: 'insert', collection: 'items', data: { name: 'a' }});
    await bus.execute({ action: 'insert', collection: 'items', data: { name: 'b' }});
    var c = await SubModel.find(bus, { name: /a|b/ });
    expect(c.length).to.be(2);
  });

  it('can create a tailable collection of items', async function() {
    await bus.execute({ action: 'insert', collection: 'items', data: { _id: 1, name: 'a' }});
    var c = await SubModel.find(bus, { name: /a|b|c/ }, { tail: true });
    expect(c.length).to.be(1);
    await bus.execute({ action: 'insert', collection: 'items', data: { _id: 2, name: 'b' }});
    await timeout(0);
    expect(c.length).to.be(2);
    expect(c.at(1).source.name).to.be('b');
    await bus.execute({ action: 'remove', collection: 'items', query: { name: 'a' }});
    await timeout(0);
    expect(c.length).to.be(1);
    expect(c.at(0).source.name).to.be('b');
    await bus.execute({ action: 'update', collection: 'items', data: { _id: 2, name: 'c' }, query: { name: 'b' }});
    await timeout(0);
    expect(c.at(0).source.name).to.be('c');
  });

  it('only syns based on the query', async function() {
    await bus.execute({ action: 'insert', collection: 'items', data: { _id: 1, name: 'a' }});
    var c = await SubModel.find(bus, { name: /a|b/ }, { tail: true });
    expect(c.length).to.be(1);

    // sanity
    await bus.execute({ action: 'insert', collection: 'items', data: { _id: 2, name: 'b' }});
    await timeout(0);
    expect(c.length).to.be(2);
    expect(c.at(1).source.name).to.be('b');

    await bus.execute({ action: 'insert', collection: 'items2', data: { _id: 2, name: 'b' }});
    await timeout(0);
    expect(c.length).to.be(2);

    await bus.execute({ action: 'insert', collection: 'items', data: { _id: 4, name: 'e' }});
    await timeout(0);
    expect(c.length).to.be(2);
  });

  // it('removes items from a tailed collection if there's a mismatch in query')
});
