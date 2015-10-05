import BaseApplication from "common/application";
import createBus       from "./bus";
import mdns            from "common/plugins/mdns";

class SlaveApplication extends BaseApplication {

  /**
   */

  pkg = require("./package.json")

  /**
   */

  initializePlugins() {
    this.bus = createBus(this, this.bus);
    this.use(mdns);
    super.initializePlugins();
  }
}

/**
 */

module.exports = SlaveApplication;
