import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import createMemoryBus    from "common/bus/drivers/memory";
import co                 from "co";
import Window             from "./window";
import sift               from "sift";
import createBus          from "./bus";

/**
 */

class RemoteDesktop extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    Object.assign(this, properties);
    this.bus = createBus(this);
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
