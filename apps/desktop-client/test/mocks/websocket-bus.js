import { Bus } from "mesh";

class WebSocketBusMock extends Bus {
  constructor({app, host}, bus) {
    super();
    this.host = host;
    this._bus = bus;
  }
  execute(operation) {
    this.ops = operation
    return this._bus.execute(operation);
  }
}

export default WebSocketBusMock;
