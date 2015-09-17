import BaseApplication from "common/application";
import http            from "./http";
// import emailer         from "./emailer";
// import stripe          from "./stripe";
import createBus       from "./bus";
// import jobs            from "./jobs";
 
class SlaveApplication extends BaseApplication {

  /**
   */

  initializePlugins() {
    this.bus = createBus(this, this.bus);
    this.use(http);
    super.initializePlugins();
  }
}

/**
 */

module.exports = SlaveApplication;
