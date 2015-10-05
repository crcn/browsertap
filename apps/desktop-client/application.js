import BaseApplication from "common/application";
import createBus       from "./bus";
import mdns            from "common/plugins/mdns";

class Application extends BaseApplication {

  /**
   */

  constructor(properties) {
    super(properties);
  }

  /**
   */

  initializePlugins() {
    this.bus = createBus(this, this.bus);
    this.use(mdns);
    super.initializePlugins();
  }
};

/**
 */

export default Application;
