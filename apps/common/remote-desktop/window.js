import Model from "common/data/models/base/model"
import co from "co";
import Peer from "./peer";

/**
 */

class Window extends Model {

  /**
   */

  constructor(properties) { 
    super(properties);
  }

  /**
   * start the session
   */

  show() {
    return co(function*() {
      var data = yield this.bus({ name: "startWindowSession", query: { id: this.id } }).read();
      var peer = new Peer(Object.assign({ bus: this.bus }, data));
      return peer;
    }.bind(this));
  }
}

/**
 */

export default Window;