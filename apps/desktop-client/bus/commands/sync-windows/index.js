import CommandBus       from 'common/mesh/bus/command';
import sift             from 'sift';
import BrowserWindow    from 'browser-window';
import syncDbCollection from 'common/mesh/utils/sync-db-collection';
import DataObject       from 'common/data/object';
import FilterThrough    from 'common/mesh/stream/filter-through';
import ModelCollection  from 'common/data/models/collection';
import BusWriter        from 'common/mesh/stream/bus-writer';
import CollectionBus    from 'common/mesh/bus/collection';


class VirtWindow extends DataObject {
  constructor(properties, app) {
    super(properties);
    this.app = app;
    this._window = new BrowserWindow({
      width: properties.source.width,
      height: properties.source.height
    });

    this._window.loadUrl(__dirname + '/window.html');
  }
  dispose() {
    console.log('dispose');
  }
}

export default {
  create: function(app) {

    return CommandBus.create({
      execute: execute
    });

    // TODO - change to async
    function execute(operation) {

      app.logger.info('synchronizing virtual windows');

      /* TODO - CollectionReader
      .create(VirtWindow.find({ }).awaitChang())
      .pipeTo(ArrayChangeToDbOpsThrough.create())
      .pipeTo(BusWriter.create(
        CollectionBus.create(

        )
      ))
      */
      app.bus.execute({
        action: 'tail'
      })
      .pipeTo(FilterThrough.create(function(operation) {

        // TODO - need to fix logic here - ignoring windows
        // like this is likely going to cause bugs
        if (operation.collection !== 'virtWindows') return false;
        if (operation.action !== 'insert') return true;
        return operation.data.width > 60 &&
        operation.data.height > 60 &&
        operation.data.title !== '';
      }))
      .pipeTo(
        BusWriter.create(
          CollectionBus.create(
            ModelCollection.create({
              createModel: (properties) => VirtWindow.create(properties, app)
            }).getSourceCollection()
          )
        )
      )
    }

  }
}
