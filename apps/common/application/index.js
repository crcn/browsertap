import BaseModel from "common/data/models/base/model";
import flatten from "lodash/array/flattenDeep";
import Logger from "common/logger";
import catchError from "./plugins/catch-errors";
import CommonBus from "common/mesh/bus/log";
import LogBus    from "common/mesh/bus/log";
import readAll from "common/mesh/read-all";
/**
 */

class Application extends BaseModel {

  /**
   */

  constructor(properties) {
    super(properties);

    this.bus = new CommonBus(this, this.bus);

    this.logger = new Logger(Object.assign({
      bus: new LogBus(this)
    }, this.get("config.log")));
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
    return readAll(this.bus.execute({ name: "initialize" }));
  }

  /**
   */

  initializePlugins() {
    this.use(catchError);
  }

  /**
   */

  dispose() {
    return readAll(this.bus.execute({ name: "dispose" }));
  }
}

/**
 */

export default Application;
