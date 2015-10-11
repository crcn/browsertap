import BaseApplication  from "common/application";
import DesktopClientBus from "./bus";
import mdns             from "common/plugins/mdns";

class Application extends BaseApplication {

  /**
   */

  classes = {}

  /**
   */

  constructor(properties) {
    super(properties);
  }

  /**
   */

  initializePlugins() {
    this.bus = new DesktopClientBus(this, this.bus);
    this.use(mdns);
    super.initializePlugins();
  }
};

/**
 */

export default Application;
