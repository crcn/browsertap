import SyncWindowsCommand from './index';
import CollectionBus from 'common/mesh/bus/collection';
import { TailableBus, AcceptBus, WrapBus } from 'mesh';
import sift from 'sift';
import { timeout } from 'common/test/utils';
import BrowserWindow from 'browser-window';
import expect from 'expect.js';

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

  it('opens a real window when a virtual window has been added', async function() {
    var bus = SyncWindowsCommand.create(app);
    await bus.execute(); // initialize
    await app.bus.execute({
      action: 'insert',
      collection: 'virtWindows',
      data: { _id: 1, width: 100, height: 200 }
    });

    await timeout(0);

    var win = BrowserWindow.references.shift();
    expect(win.width).to.be(100);
    expect(win.height).to.be(200);
    expect(win.loadUrl.callCount).to.be(1);
  });

  it('skips windows that are too small', async function() {
    var bus = SyncWindowsCommand.create(app);
    await bus.execute(); // initialize
    await app.bus.execute({
      action: 'insert',
      collection: 'virtWindows',
      data: { _id: 1, width: 50, height: 100 }
    });

    await timeout(0);
    expect(BrowserWindow.references.length).to.be(0);
  });

  xit('closes a window when a virtual window has been removed');
  xit('only sync virtual windows - ignores other synced collection items')
});
