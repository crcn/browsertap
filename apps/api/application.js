import BaseApplication from "common/application";
import extend          from "lodash/object/extend";
import cluster         from "cluster";
import http            from "./http";
import emailer         from "./emailer";
import createBus       from "./bus";

class APIApplication extends BaseApplication {

  /**
   */

  intl = {
    messages: require("common/translations/en")
  }

  /**
   */ 

  initialize(next) {

    this.logger.info("hosts: ", this.get("config.hosts"));

    // fork it?
    if (cluster.isMaster && this.get("config.numCores") > 0) {
      this.logger.info("fourk it %d times ✊", this.config.numCores);
      for (var i = this.config.numCores; i--;) this.fork();
      if (next) next();
      return;
    }

    return super.initialize(next);
  }

  /**
   */

  initializePlugins() {
    this.bus = createBus(this, this.bus);
    super.initializePlugins();
    if (this.debug !== true) {
      this.use(http);
    }
    this.use(emailer);
  }

  /**
   */

  fork() {
    cluster.fork().once("exit", this.fork.bind(this));
  }
}

/**
 */

module.exports = APIApplication;
