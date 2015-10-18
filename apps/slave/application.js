import BaseApplication from "common/application";
import SlaveBus       from "./bus";
import mdns            from "common/plugins/mdns";

class SlaveApplication extends BaseApplication {

  /**
   */

  pkg = require("./package.json")

  /**
   */

  initializePlugins() {
    this.bus = SlaveBus.create(this, this.bus);
    this.use(mdns);
    super.initializePlugins();
  }
}

/**
 */

module.exports = SlaveApplication;
