import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import co                 from "co";
import VirtWindow         from "./virt-window";

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
  }

  /**
   */

  getScreens() {
    return co(function*() {
      return (yield this.bus({ name: "find", collection: "virtWindows" }).readAll()).map(function(data) {
        return new VirtWindow(data);
      });
    }.bind(this));
  }
};

/**
 */

export default RemoteDesktop;
