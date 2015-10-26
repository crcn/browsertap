import SyncWindowsCommand from './index';
import CollectionBus from 'common/mesh/bus/collection';
import { TailableBus, AcceptBus, WrapBus } from 'mesh';
import sift from 'sift';
import { timeout } from 'common/test/utils';

describe(__filename + '#', function() {

  var virtWindows;
  var openWindows;
  var bus;
  var app;

  beforeEach(function() {
    virtWindows = [];
    openWindows = [];
    bus = CollectionBus.create(virtWindows);
    bus = TailableBus.create(bus);
    bus = AcceptBus.create(sift({ action: 'tail' }), WrapBus.create(bus.createTail.bind(bus)), bus);
    app = { bus: bus, logger: { info: function() { }} };
  });

  it('can be created', function() {
    var bus = SyncWindowsCommand.create();
  });

  it('executes an openWindow command when a virtual window is added', async function() {
    var bus = SyncWindowsCommand.create(app);
    await bus.execute(); // initialize
    await app.bus.execute({
      action: 'insert',
      collection: 'virtWindows',
      data: { _id: 1 }
    });
    await app.bus.execute({
      action: 'update',
      collection: 'virtWindows',
      data: { _id: 9 },
      query: { _id: 1 }
    });
    await app.bus.execute({
      action: 'update',
      collection: 'virtWindows',
      data: { _id: 4 },
      query: { _id: 9 }
    });
    await timeout(0);
    await app.bus.execute({
      action: 'remove',
      collection: 'virtWindows',
      query: { _id: 9 }
    });
  });
});
