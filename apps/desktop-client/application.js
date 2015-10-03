import commands from "./commands";
import BaseApplication from "common/application";

class Application extends BaseApplication {

  /**
   */

  constructor(properties) {
    super(properties);
  }

  /**
   */

  initializePlugins() {
    super.initializePlugins();
    this.use(commands);
  }
};

export default Application;
