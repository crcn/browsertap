import BaseApplication from "common/application";
import createBus       from "./bus";

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
    super.initializePlugins();
  }
};

/**
 */

export default Application;
