import { EventEmitter }   from "events";
import mesh               from "common/mesh";
import createWebsocketBus from "common/bus/drivers/websocket";
import co                 from "co";
import Window             from "./window";


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
    this.bus = mesh.spy(this.bus);
  }

  /**
   */

  getWindows() {
    return co(function*() { 
      return (yield this.bus({ name: "find", collection: "virtWindows" }).readAll()).map(function(data) {
        return new Window(Object.assign({ bus: this.bus }, data));
      }.bind(this));
    }.bind(this));
  }
};

/**
 */

export default RemoteDesktop;
