import { Bus, Response } from 'mesh';
import sift from 'sift';

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
    if (operation.action === 'tail') {
      return Response.create((writable) => {
        this._tails.push(writable);
        writable.filter = operation.filter ? sift(operation.filter) : function() {
          return true;
        };

        writable.then(() => {
          this._tails.splice(this._tails.indexOf(writable), 1);
        });
      });
    } else {
      var ret = this._bus.execute(operation);
      this._tails.forEach((tail) => {
        if (tail.filter(operation)) tail.write(operation);
      });
      return ret;
    }
  }
}

/**
 */

export default TailableBus;
