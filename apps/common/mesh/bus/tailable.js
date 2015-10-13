import { Bus, AsyncResponse } from "mesh";

/**
 * Makes a bus tailable
 */

class TailableBus extends Bus {

  /**
   */

  constructor(bus) {
    super();
    this._bus   = bus;
    this._tails = [];
  }

  /**
   */
   
  execute(operation) {
    if (operation.name === "tail") {
      return new AsyncResponse((writable) => {
        this._tails.push(writable);
        writable.then(() => {
          this._tails.splice(this._tails.indexOf(writable), 1);
        });
      });
    } else {
      var ret = this._bus.execute(operation);
      this._tails.forEach((tail) => {
        tail.write(operation);
      });
      return ret;
    }
  }
}

/**
 */

export default TailableBus;
