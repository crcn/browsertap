import BaseApplication from "common/application";
import Slavebus       from "./bus";
import mdns            from "common/plugins/mdns";

class SlaveApplication extends BaseApplication {

  /**
   */

  pkg = require("./package.json")

  /**
   */

  initializePlugins() {
    this.bus = new SlaveBus(this, this.bus);
    this.use(mdns);
    super.initializePlugins();
  }
}

/**
 */

module.exports = SlaveApplication;
