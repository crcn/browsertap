import { EventEmitter }   from "events";
import co                 from "co";
import Window             from "./window";
import sift               from "sift";
import RemoteDesktopBus          from "./bus";

/**
 */

class RemoteDesktop extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    Object.assign(this, properties);
    this.bus = new RemoteDesktopBus(this);
  }

  /**
   */

  *getWindows() {
    return yield Window.all(this.bus);
  }
};

/**
 */

export default RemoteDesktop;
