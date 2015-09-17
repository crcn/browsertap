import { EventEmitter } from "events";
import Connection from "./connection";

/**
 */

class RemoteDesktop extends EventEmitter {

  /**
   */

  constructor(properties) {
    super();
    Object.assign(this, properties);
    this.connect();
  }

  /**
   */

  connect() {
    this._connection = new Connection();
    this._connection.connect(this.host);
  }
};

/**
 */

export default RemoteDesktop;
