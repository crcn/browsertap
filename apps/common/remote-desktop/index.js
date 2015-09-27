import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import co                 from "co";

/**
 */

class RemoteDesktop extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    Object.assign(this, properties);

    this.initialize();
  }

  /**
   */

  initialize() {
    this.bus = createWebsocketBus({
      host: this.host
    });
    co(this._hydrate());
  }

  /**
   */

  *_hydrate() {
    var windows = yield this.bus({ name: "find", collection: "virtWindows" }).readAll();
    console.log(windows);
  }
};

/**
 */

export default RemoteDesktop;
