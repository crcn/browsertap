var BaseModel       = require("common/data/models/base/model");
var extend          = require("lodash/object/extend");
var mesh            = require("mesh");
var flatten         = require("lodash/array/flattenDeep");
var Logger          = require("common/logger");
var createBus       = require("common/bus");
var catchError      = require("./plugins/catch-errors");
var createCommonBus = require("common/bus");

/**
 */


class Application extends BaseModel {

  /**
   */

  constructor(properties) {
    super(properties);

    this.bus = createCommonBus(this);

    this.logger = new Logger(extend({
      bus: function(operation) {
        return this.bus(operation);
      }.bind(this)
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
    return this.bus({ name: "initialize" });
  }

  /**
   */

  initializePlugins() {
    this.use(catchError);
  }

  /**
   */

  dispose() {
    return this.bus({ name: "dispose" });
  }
}

/**
 */

export default Application;
