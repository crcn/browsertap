import { Bus, NoopBus, Response } from 'mesh'

class SpyBus extends Bus {
  constructor(bus) {
    super();
    this._bus = bus || NoopBus.create();
    this._spies = [];
  }
  execute(operation) {

    if (operation.action === 'spy') {
      return Response.create((writable) => {
        writable.operation = operation;
        writable.then(() => {
          this._spies.splice(this._spices.indexOf(writable), 1);
        });
        this._spies.push(writable);
      });
    }

    var response       = this._bus.execute(operation);
    response.operation = operation;

    this._spies.forEach((spy) => {
      if (spy.operation.filter && !spy.operation.filter(operation)) return;
      spy.write({
        operation: operation,
        response: response
      });
    });

    return response;
  }
}

export default SpyBus;
