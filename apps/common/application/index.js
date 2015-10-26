import BaseModel from 'common/data/models/base/model';
import flatten from 'lodash/array/flattenDeep';
import Logger from 'common/logger';
import catchError from './plugins/catch-errors';
import CommonBus from 'common/mesh/bus/log';
import LogBus    from 'common/mesh/bus/log';
import readAll from 'common/mesh/utils/read-all';

/**
 */

class Application extends BaseModel {

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
    return readAll(this.bus.execute({ action: 'initialize' }));
  }

  /**
   */

  initializePlugins() {
    this.use(catchError);
  }

  /**
   */

  dispose() {
    return readAll(this.bus.execute({ action: 'dispose' }));
  }
}

/**
 */

export default Application;
