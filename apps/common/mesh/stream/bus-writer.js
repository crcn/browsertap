import { WritableStream } from "mesh";

class BusWriter extends WritableStream {
  constructor(bus) {
    super();
    this.getReader().pipeTo({
      write: (operation) => {
        console.log(bus);
        return bus.execute(operation).read();
      },
      abort: function() { },
      close: function() { }
    });
  }
}

export default BusWriter;
