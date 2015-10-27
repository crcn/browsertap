import BaseModel  from 'common/data/models/model';
import flatten    from 'lodash/array/flattenDeep';
import Logger     from 'common/logger';
import catchError from './plugins/catch-errors';
import CommonBus  from 'common/mesh/bus/log';
import LogBus     from 'common/mesh/bus/log';
import DataObject from 'common/data/object';

/**
 */

class Application extends DataObject {

  /**
   */

  constructor(properties) {
    super(properties);

    this.bus = CommonBus.create(this, this.bus);

    this.logger = new Logger(Object.assign({
      bus: LogBus.create(this)
    }, this.config.log));
  }

  /**
   */

  use() {
    flatten(Array.prototype.slice.call(arguments)).forEach(function(plugin) {
      plugin(this);
    }.bind(this));
  }

  /**
   */

  initialize() {
    this.initializePlugins();
    return this.bus.execute({ action: 'initialize' }).readAll();
  }

  /**
   */

  initializePlugins() {
    this.use(catchError);
  }

  /**
   */

  dispose() {
    return this.bus.execute({ action: 'dispose' }).readAll();
  }
}

/**
 */

export default Application;
