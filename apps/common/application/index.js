import BaseModel from "common/data/models/base/model";
import flatten from "lodash/array/flattenDeep";
import Logger from "common/logger";
import createBus from "common/bus";
import catchError from "./plugins/catch-errors";
import createCommonBus from "common/bus";
import createLogBus    from "common/bus/log";

/**
 */

class Application extends BaseModel {

  /**
   */

  constructor(properties) {
    super(properties);

    this.bus = createCommonBus(this, this.bus);

    this.logger = new Logger(Object.assign({
      bus: createLogBus(this)
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
    return this.bus({ name: "initialize" }).readAll();
  }

  /**
   */

  initializePlugins() {
    this.use(catchError);
  }

  /**
   */

  dispose() {
    return this.bus({ name: "dispose" }).readAll();
  }
}

/**
 */

export default Application;
