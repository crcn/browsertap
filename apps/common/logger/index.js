import BaseModel from "common/data/models/base/model";
import extend from "lodash/object/extend";
import LogLevels from "./levels";
import { NoopBus } from "mesh";

var noop = NoopBus.create();

class Logger extends BaseModel {

  /**
   */

  bus: noop

  /**
   */

  level: LogLevels.ALL

  /**
   * TODO
   */

  child(prefix) {
    return new Logger({
      prefix : prefix,
      bus    : this.bus,
      level  : this.level,
      parent : this
    });
  }
}

/**
 * attach the methods
 */

Object.keys(LogLevels).forEach(function(key) {
  var code = LogLevels[key];
  if (!(code & LogLevels.NONE)) {
    var type = key.toLowerCase();
    Logger.prototype[type] = function() {
      if (!(this.level & code)) return;
      this.bus.execute({

        // blast off into the either. Enable any handler for logs.
        action: "log",

        // add english term to log
        type: type,

        // maintain consistent property
        level: code,

        // don't do anything to the arguments
        args: Array.prototype.slice.call(arguments, 0)
      });
    };
  }
});

/**
 */

export default Logger;
